import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './PhotoGrid.module.css';

interface PhotoGridProps {
    photos: any[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
    if (!photos || photos.length === 0) return null;

    return (
        <div className={styles.grid}>
            {photos.map((photo, index) => (
                <div key={index} className={styles.photoWrapper}>
                    <Image
                        src={urlFor(photo).width(400).height(400).url()}
                        alt={`Profile photo ${index + 1}`}
                        width={200}
                        height={200}
                        className={styles.photo}
                    />
                </div>
            ))}
        </div>
    );
}
