import Link from 'next/link';
import styles from './Navbar.module.css';
import ScrambleText from './ScrambleText';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <ScrambleText text="VEDANG_PODDAR" />
                </Link>

                <div className={styles.rightSide}>
                    <ul className={styles.links}>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/reading">Reading</Link></li>
                        <li><Link href="/projects">Projects</Link></li>
                    </ul>
                    <div className={styles.statusBadge}>
                        <span className={styles.statusDot}></span>
                        <span className={styles.statusText}>ONLINE</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
