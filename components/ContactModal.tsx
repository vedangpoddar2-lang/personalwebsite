'use client';

import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaLinkedin, FaTimes } from 'react-icons/fa';
import styles from './ContactModal.module.css';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    formId: string;
    zcalLink: string;
    linkedinUrl?: string;
}

export default function ContactModal({ isOpen, onClose, formId, zcalLink, linkedinUrl }: ContactModalProps) {
    const [activeTab, setActiveTab] = useState<'message' | 'book'>('message');
    const [state, handleSubmit] = useForm(formId);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Get in Touch</h2>
                    <p className={styles.subtitle}>
                        {activeTab === 'message'
                            ? "Send me a message and I'll get back to you."
                            : "Pick a time that works for you."}
                    </p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'message' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('message')}
                    >
                        Send Message
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'book' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('book')}
                    >
                        Book Meeting
                    </button>
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.tab} ${styles.linkedinTab}`}
                            aria-label="LinkedIn"
                        >
                            LinkedIn <FaLinkedin style={{ marginLeft: '0.5rem' }} />
                        </a>
                    )}
                </div>

                <div className={styles.content}>
                    {activeTab === 'message' ? (
                        <div className={styles.formContainer}>
                            {state.succeeded ? (
                                <div className={styles.successMessage}>
                                    <h3>Message Sent! 🎉</h3>
                                    <p>Thanks for reaching out. I'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.formContainer}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="name" className={styles.label}>Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            className={styles.input}
                                            placeholder="Your name"
                                            required
                                        />
                                        <ValidationError prefix="Name" field="name" errors={state.errors} />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="email" className={styles.label}>Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className={styles.input}
                                            placeholder="your@email.com"
                                            required
                                        />
                                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="message" className={styles.label}>Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            className={styles.textarea}
                                            placeholder="What's on your mind?"
                                            required
                                        />
                                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                                    </div>

                                    <button type="submit" className={styles.submitBtn} disabled={state.submitting}>
                                        {state.submitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className={styles.zcalContainer}>
                            <iframe
                                src={zcalLink}
                                className={styles.iframe}
                                title="Schedule a meeting"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
