'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Reading', path: '/reading' },
        { name: 'Projects', path: '/projects' },
    ];

    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
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
                </ul>
            </div>
        </nav>
    );
}
