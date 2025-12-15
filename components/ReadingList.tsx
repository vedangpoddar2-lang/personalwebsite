import Link from 'next/link';
import styles from './ReadingList.module.css';

interface ReadingItem {
    _id: string;
    title: string;
    link: string;
    category: string;
    description: string;
    dateAdded: string;
}

interface ReadingListProps {
    items: ReadingItem[];
}

export default function ReadingList({ items }: ReadingListProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={styles.grid}>
            {items.map((item) => (
                <div key={item._id} className={styles.card}>
                    <div className={styles.header}>
                        <span className={`${styles.tag} ${styles[item.category]}`}>
                            {item.category}
                        </span>
                        <span className={styles.date}>
                            {new Date(item.dateAdded).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className={styles.title}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                        </a>
                    </h3>
                    <p className={styles.description}>{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Visit Source →
                    </a>
                </div>
            ))}
        </div>
    );
}
