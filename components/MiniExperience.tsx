'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './MiniExperience.module.css';

interface OtherExperienceItem {
    _id: string;
    company: string;
    role: string;
    logo: any;
    logoWidth?: number;
    description?: string;
}

interface MiniExperienceProps {
    items: OtherExperienceItem[];
}

export default function MiniExperience({ items }: MiniExperienceProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={styles.container}>
            {items.map((item) => (
                <div key={item._id} className={styles.item}>
                    {item.description && (
                        <div className={styles.tooltip}>
                            {item.description}
                        </div>
                    )}

                    <div className={styles.logoWrapper}>
                        {item.logo && (
                            <Image
                                src={urlFor(item.logo).url()}
                                alt={item.company}
                                width={item.logoWidth || 50}
                                height={item.logoWidth || 50} // Aspect ratio handled by object-fit, but we need a height for layout
                                style={{
                                    width: `${item.logoWidth || 50}px`,
                                    height: 'auto',
                                    maxHeight: '80px' // Prevent excessively tall logos
                                }}
                                className={styles.logo}
                            />
                        )}
                    </div>

                    <h5 className={styles.company}>{item.company}</h5>
                    <span className={styles.role}>{item.role}</span>
                </div>
            ))}
        </div>
    );
}
