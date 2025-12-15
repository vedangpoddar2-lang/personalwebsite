'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
}

const CHARS = '-_~=+*!@#%&^<>';

export default function ScrambleText({ text, className }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const scramble = () => {
        let iteration = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        scramble();
    }, []);

    return (
        <span
            className={className}
            onMouseEnter={scramble}
            style={{ fontFamily: 'monospace', cursor: 'default' }}
        >
            {displayText}
        </span>
    );
}
