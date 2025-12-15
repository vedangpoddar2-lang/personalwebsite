'use client';

import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import styles from './ProjectTable.module.css';
import MediaGallery from './MediaGallery';

interface ProjectFile {
    _key: string;
    originalFilename: string;
    url: string;
}

interface Project {
    _id: string;
    title: string;
    shortDescription: string;
    description: any; // Block array
    date: string;
    link?: string;
    files?: any[]; // Updated to accept Sanity file objects
}

interface ProjectTableProps {
    items: Project[];
}

export default function ProjectTable({ items }: ProjectTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (!items || items.length === 0) return null;

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Description</th>
                        <th>Resources</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <>
                            <tr key={item._id} className={expandedId === item._id ? styles.expandedRow : ''}>
                                <td className={styles.dateCell}>
                                    {item.date ? new Date(item.date).getFullYear() : '-'}
                                </td>
                                <td className={styles.titleCell}>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                            {item.title} ↗
                                        </a>
                                    ) : (
                                        item.title
                                    )}
                                </td>
                                <td className={styles.descCell}>
                                    <div className={styles.shortDesc}>
                                        {item.shortDescription}
                                        {item.description && (
                                            <button onClick={() => toggleExpand(item._id)} className={styles.moreBtn}>
                                                {expandedId === item._id ? 'Show Less' : 'Read More'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className={styles.filesCell}>
                                    {/* Only show download links for quick access if needed, or rely on expanded view */}
                                    {item.files && item.files.length > 0 && (
                                        <span className={styles.fileCount}>{item.files.length} File(s)</span>
                                    )}
                                </td>
                            </tr>
                            {expandedId === item._id && item.description && (
                                <tr className={styles.detailsRow}>
                                    <td colSpan={4}>
                                        <div className={styles.detailsContent}>
                                            <div className={styles.detailedDescription}>
                                                <PortableText value={item.description} />
                                            </div>

                                            {item.files && item.files.length > 0 && (
                                                <div className={styles.mediaSection}>
                                                    <h4 style={{ marginBottom: '1rem' }}>Project Files</h4>
                                                    <MediaGallery items={item.files} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
