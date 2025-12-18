'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './BottomBanner.module.css';

interface BottomBannerProps {
    text?: string;
}

export default function BottomBanner({ text }: BottomBannerProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (pathname?.startsWith('/studio')) return;

        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px buffer
            setIsVisible(scrolledToBottom);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!text || pathname?.startsWith('/studio')) return null;

    return (
        <div className={`${styles.banner} ${isVisible ? styles.visible : ''}`}>
            <p className={styles.text}>{text}</p>
        </div>
    );
}
