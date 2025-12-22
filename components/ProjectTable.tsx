'use client';

import { useState, Fragment } from 'react';
import { PortableText } from '@portabletext/react';
import styles from './ProjectTable.module.css';

import ProjectFileCarousel from './ProjectFileCarousel';

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
    category?: string;
    files?: any[]; // Updated to accept Sanity file objects
}

interface ProjectTableProps {
    items: Project[];
}

export default function ProjectTable({ items }: ProjectTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (!items || items.length === 0) return null;

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

    // Filter items
    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter(item => item.category === selectedCategory);

    return (
        <div className={styles.container}>
            {/* Category Filter */}
            <div className={styles.filterContainer}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category as string)}
                        className={`${styles.filterBtn} ${selectedCategory === category ? styles.activeFilter : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

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
                        {filteredItems.map((item) => (
                            <Fragment key={item._id}>
                                <tr className={expandedId === item._id ? styles.expandedRow : ''}>
                                    <td className={styles.dateCell}>
                                        {item.date ? new Date(item.date).getFullYear() : '-'}
                                    </td>
                                    <td className={styles.titleCell}>
                                        <div className={styles.titleWrapper}>
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                                    {item.title} ↗
                                                </a>
                                            ) : (
                                                <span className={styles.projectTitle}>{item.title}</span>
                                            )}
                                            {item.category && (
                                                <span className={styles.categoryBadge}>
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
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
                                        {item.files && item.files.length > 0 ? (
                                            <ProjectFileCarousel files={item.files} />
                                        ) : (
                                            <span className={styles.noFiles}>-</span>
                                        )}
                                    </td>
                                </tr>
                                {expandedId === item._id && item.description && (
                                    <tr className={styles.detailsRow}>
                                        <td colSpan={4}>
                                            <div className={styles.detailsContent}>
                                                <div className={`${styles.detailedDescription} portable-text`}>
                                                    <PortableText value={item.description} />
                                                </div>


                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
