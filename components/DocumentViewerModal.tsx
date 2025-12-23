'use client';

import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import GatedPDFViewer from './GatedPDFViewer';
import styles from './DocumentViewerModal.module.css';

interface DocumentViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    documentTitle?: string;
    previewPages?: number;
}

export default function DocumentViewerModal({
    isOpen,
    onClose,
    pdfUrl,
    documentTitle = 'Document',
    previewPages = 4
}: DocumentViewerModalProps) {
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

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{documentTitle}</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close viewer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className={styles.viewerContainer}>
                    <GatedPDFViewer
                        pdfUrl={pdfUrl}
                        documentTitle={documentTitle}
                        previewPages={previewPages}
                    />
                </div>
            </div>
        </div>
    );
}
