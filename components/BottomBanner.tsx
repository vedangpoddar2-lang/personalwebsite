'use client';

import { usePathname } from 'next/navigation';
import HighlighterTag from './HighlighterTag';
import styles from './BottomBanner.module.css';

interface BottomBannerProps {
    text?: string;
}

export default function BottomBanner({ text }: BottomBannerProps) {
    const pathname = usePathname();

    if (!text || pathname?.startsWith('/studio')) return null;

    return (
        <footer className={styles.banner}>
            <div className="container">
                <div className={styles.tagWrapper}>
                    <HighlighterTag text={text} />
                </div>
            </div>
        </footer>
    );
}
