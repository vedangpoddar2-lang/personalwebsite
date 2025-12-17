'use client';

import { useState, useEffect } from 'react';
import styles from './BottomBanner.module.css';

interface BottomBannerProps {
    text?: string;
}

export default function BottomBanner({ text }: BottomBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px buffer
            setIsVisible(scrolledToBottom);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!text) return null;

    return (
        <div className={`${styles.banner} ${isVisible ? styles.visible : ''}`}>
            <p className={styles.text}>{text}</p>
        </div>
    );
}
