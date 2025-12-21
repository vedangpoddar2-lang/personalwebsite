'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDownload } from 'react-icons/fa';
import ContactModal from './ContactModal';
import styles from './Navbar.module.css';

interface NavbarProps {
    resumeUrl?: string;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
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

                    {/* Centered Desktop Links */}
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
                        <li>
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className={styles.link}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Contact
                            </button>
                        </li>
                    </ul>

                    {/* Right-aligned CV Button */}
                    {resumeUrl && (
                        <div className={styles.resumeContainer}>
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.resumeBtn}
                            >
                                <FaDownload className={styles.downloadIcon} /> CV
                            </a>
                        </div>
                    )}

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
                            <li>
                                <button
                                    onClick={() => {
                                        setIsContactOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className={styles.mobileLink}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
                                >
                                    Contact
                                </button>
                            </li>
                            {resumeUrl && (
                                <li>
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.mobileLink}
                                        style={{ fontSize: '1.5rem', opacity: 1, color: 'var(--primary)' }}
                                    >
                                        <FaDownload style={{ marginRight: '0.5rem' }} /> CV
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                formId="xojadryl"
                zcalLink="https://zcal.co/i/wIvrKv34?embed=1"
                linkedinUrl="https://www.linkedin.com/in/vedangpoddar/"
            />
        </>
    );
}
