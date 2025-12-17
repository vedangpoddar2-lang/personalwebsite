'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavbarProps {
    resumeUrl?: string;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Reading', path: '/reading' },
        { name: 'Projects', path: '/projects' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                {/* Hamburger Button */}
                <button
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>

                {/* Desktop Links */}
                <ul className={styles.links}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    {resumeUrl && (
                        <li>
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.resumeBtn}
                            >
                                Download CV
                            </a>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Overlay */}
                <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                    <ul className={styles.mobileLinks}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`${styles.mobileLink} ${pathname === item.path ? styles.active : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                        {resumeUrl && (
                            <li>
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.mobileLink}
                                    style={{ fontSize: '1.5rem', opacity: 1, color: 'var(--primary)' }}
                                >
                                    Download CV
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
