'use client';

import React, { useMemo, useState, useEffect } from 'react';
import styles from './HighlighterTag.module.css';

interface HighlighterTagProps {
    text: string;
}

// Simple seeded random number generator
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Generate path data deterministically
const generatePathData = (text: string) => {
    let seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const getRandom = () => {
        const val = seededRandom(seed);
        seed++;
        return val;
    };

    const id = `roughness-${text.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(getRandom() * 1000)}`;

    // Reduced Height Zig-Zag
    const charCount = text.length;
    const steps = Math.max(16, Math.ceil(charCount * 1.2));

    // Start at x=4 (Tightened further)
    let d = `M 4 ${45 + getRandom() * 5}`;

    const totalWidth = 92; // Reduced width to 92 for tighter fit
    const stepWidth = totalWidth / steps;

    for (let i = 1; i <= steps; i++) {
        const x = 4 + (i * stepWidth);
        // Reduced Vertical Range (12 to 48)
        const isTop = i % 2 !== 0;
        const y = isTop
            ? 12 + getRandom() * 5   // Top peak
            : 43 + getRandom() * 5;  // Bottom valley

        // Randomize X slightly
        const randomX = x - 1 + getRandom() * 2;

        d += ` L ${randomX} ${y}`;
    }

    return { pathD: d, filterId: id };
};

export default function HighlighterTag({ text }: HighlighterTagProps) {
    const [animationKey, setAnimationKey] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Only generate path after mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate path data only on client
    const { pathD, filterId } = useMemo(() => {
        if (!mounted) {
            return { pathD: '', filterId: 'placeholder' };
        }
        return generatePathData(text);
    }, [text, mounted]);

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setAnimationKey(prev => prev + 1)}
        >
            <span className={styles.text}>{text}</span>
            {mounted && (
                <svg
                    className={styles.svgContainer}
                    viewBox="0 0 100 60"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                            {/* 
                                Increased Roughness for "Marker" Look
                                - baseFrequency: 0.1 (Finer grain, less smooth)
                                - numOctaves: 3 (More detail)
                            */}
                            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise" />

                            {/* 
                                Heavier Displacement
                                - scale: 5 (Distorts edges more aggressively)
                            */}
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>

                    <g filter={`url(#${filterId})`}>
                        {/* 
                            Rough Zig-Zag
                            - Stroke: 20 (Thinner to reduce stretching effect)
                            - Opacity: 0.7 (Increased opacity)
                        */}
                        <path
                            key={animationKey}
                            d={pathD}
                            stroke="#eab308"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            opacity="0.7"
                            className={styles.path}
                        />
                    </g>
                </svg>
            )}
        </div>
    );
}

