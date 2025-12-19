import { PortableText } from '@portabletext/react';
import { CustomPortableTextComponents } from './PortableTextComponents';
import styles from './BentoGrid.module.css';

interface BentoCardData {
    _key: string;
    title: string;
    label?: string;
    size?: 'small' | 'large';
    type?: 'text' | 'list' | 'flow';
    content?: any;
    listItems?: string[];
    flowData?: {
        labelFrom?: string;
        valueFrom?: any;
        labelTo?: string;
        valueTo?: any;
    };
}

interface BentoGridProps {
    items: BentoCardData[];
}

export default function BentoGrid({ items }: BentoGridProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={styles.grid}>
            {items.map((card) => {
                const isLarge = card.size === 'large';
                const cardClass = `${styles.card} ${isLarge ? styles.cardLarge : styles.cardSmall}`;

                return (
                    <div key={card._key} className={cardClass}>
                        {card.label && <span className={styles.cardLabel}>{card.label}</span>}

                        {/* Render based on type */}
                        {card.type === 'text' && (
                            <>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <div className={styles.cardDesc}>
                                    <PortableText value={card.content} components={CustomPortableTextComponents} />
                                </div>
                            </>
                        )}

                        {card.type === 'list' && (
                            <>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                {card.listItems && (
                                    <ul className={styles.competitorList}>
                                        {card.listItems.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}

                        {card.type === 'flow' && card.flowData && (
                            <div className={styles.pivotContainer}>
                                <div className={styles.pivotItem}>
                                    <span className={styles.cardLabel}>{card.flowData.labelFrom || 'Start'}</span>
                                    <div className={styles.pivotValue}>
                                        <PortableText value={card.flowData.valueFrom} components={CustomPortableTextComponents} />
                                    </div>
                                </div>
                                <div className={styles.pivotLine}></div>
                                <div className={styles.pivotItem}>
                                    <span className={styles.cardLabel}>{card.flowData.labelTo || 'End'}</span>
                                    <div className={styles.pivotValue}>
                                        <PortableText value={card.flowData.valueTo} components={CustomPortableTextComponents} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fallback for undefined type (treat as text) */}
                        {!card.type && (
                            <>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <p className={styles.cardDesc}>{card.content}</p>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
