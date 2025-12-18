'use client';

import { usePathname } from 'next/navigation';
import styles from './BottomBanner.module.css';

interface BottomBannerProps {
    text?: string;
}

export default function BottomBanner({ text }: BottomBannerProps) {
    const pathname = usePathname();

    if (!text || pathname?.startsWith('/studio')) return null;

    return (
        <footer className={styles.footer}>
            <div className="container">
                <p className={styles.text}>{text}</p>
            </div>
        </footer>
    );
}
