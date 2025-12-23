'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaLock } from 'react-icons/fa';
import styles from './GatedPDFViewer.module.css';

// PDF.js types
interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

interface PDFPageProxy {
    getViewport: (options: { scale: number }) => { width: number; height: number };
    render: (options: { canvasContext: CanvasRenderingContext2D; viewport: any }) => { promise: Promise<void> };
}

interface GatedPDFViewerProps {
    pdfUrl: string;
    documentTitle?: string;
    previewPages?: number;
    formId?: string;
}

const STORAGE_KEY_PREFIX = 'pdf_unlocked_';

export default function GatedPDFViewer({
    pdfUrl,
    documentTitle = 'Document',
    previewPages = 4,
    formId = 'xlgrazpw'
}: GatedPDFViewerProps) {
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showGate, setShowGate] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [formState, handleSubmit] = useForm(formId);
    const pdfjsLib = useRef<any>(null);

    // Use a single global key - once unlocked, all documents are unlocked
    const storageKey = 'pdf_viewer_unlocked';

    // Check localStorage for unlock status
    useEffect(() => {
        const unlocked = localStorage.getItem(storageKey);
        if (unlocked === 'true') {
            setIsUnlocked(true);
        }
    }, [storageKey]);

    // Handle form submission - instant unlock (optimistic UI)
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Immediately unlock while form submits in background
        setIsUnlocked(true);
        setShowGate(false);
        localStorage.setItem(storageKey, 'true');

        // Submit form in background
        handleSubmit(e);
    };

    // Load PDF.js and the document
    useEffect(() => {
        const loadPdf = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Dynamically import PDF.js
                const pdfjs = await import('pdfjs-dist');
                pdfjsLib.current = pdfjs;

                // Use local worker file from public folder
                pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

                // Use proxy route to bypass CORS
                const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;

                // Load the PDF document with disableWorker option
                const loadingTask = pdfjs.getDocument({
                    url: proxyUrl,
                    disableAutoFetch: true,
                    disableStream: true,
                });
                const pdf = await loadingTask.promise;

                setPdfDoc(pdf as unknown as PDFDocumentProxy);
                setTotalPages(pdf.numPages);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError('Failed to load document. Please try again.');
                setIsLoading(false);
            }
        };

        loadPdf();
    }, [pdfUrl]);

    const renderTaskRef = useRef<any>(null);

    // Render current page with high resolution
    const renderPage = useCallback(async (pageNum: number) => {
        if (!pdfDoc || !canvasRef.current) return;

        // Cancel previous render task if it exists
        if (renderTaskRef.current) {
            try {
                await renderTaskRef.current.cancel();
            } catch (error) {
                // Ignore cancel errors
            }
        }

        try {
            const page = await pdfDoc.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;

            // Calculate scale to fit container (contain mode)
            const containerWidth = canvas.parentElement?.clientWidth || 800;
            const containerHeight = canvas.parentElement?.clientHeight || 600;
            const viewport = page.getViewport({ scale: 1 });

            // Calculate scale to fit BOTH width and height
            const widthScale = containerWidth / viewport.width;
            const heightScale = containerHeight / viewport.height;
            const baseScale = Math.min(widthScale, heightScale) * 0.95; // 95% to leave a small margin

            // Optimize scale for device pixel ratio, capped at 2x for performance
            const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
            const hiResScale = baseScale * Math.min(pixelRatio, 2);
            const scaledViewport = page.getViewport({ scale: hiResScale });

            // Set canvas size at high resolution
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            // Scale down visually using CSS
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${(scaledViewport.height / hiResScale) * baseScale}px`;

            // Start new render task
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };

            const renderTask = page.render(renderContext);
            renderTaskRef.current = renderTask;

            await renderTask.promise;
            renderTaskRef.current = null;
        } catch (err: any) {
            if (err.name !== 'RenderingCancelledException') {
                console.error('Error rendering page:', err);
            }
        }
    }, [pdfDoc]);

    // Render page when currentPage or pdfDoc changes
    useEffect(() => {
        if (pdfDoc) {
            renderPage(currentPage);
        }
    }, [pdfDoc, currentPage, renderPage]);

    // Navigation handlers
    const goToPage = (pageNum: number) => {
        // Check if trying to access gated content
        if (pageNum > previewPages && !isUnlocked) {
            setShowGate(true);
            return;
        }

        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setShowGate(false);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    // Handle unlock button click
    const handleUnlockClick = () => {
        setShowGate(true);
    };

    // Check if on last preview page
    const isOnLastPreviewPage = currentPage === previewPages && !isUnlocked && totalPages > previewPages;
    const canGoNext = isUnlocked ? currentPage < totalPages : currentPage < previewPages;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* PDF Canvas */}
            <div className={styles.canvasContainer}>
                <canvas ref={canvasRef} className={styles.canvas} />

                {/* Email Gate Overlay */}
                {showGate && (
                    <div className={styles.gateOverlay}>
                        <div className={styles.gateContent}>
                            <div className={styles.lockIcon}>
                                <FaLock />
                            </div>
                            <h3>Unlock All Projects</h3>
                            <p>Enter your details to continue reading!</p>
                            <p className={styles.subText}>Would love to speak more and connect</p>

                            {formState.succeeded ? (
                                <div className={styles.successMessage}>
                                    <p>✓ Unlocked! Loading full document...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className={styles.gateForm}>
                                    <input type="hidden" name="document" value={documentTitle} />
                                    <input type="hidden" name="documentUrl" value={pdfUrl} />

                                    <div className={styles.formGroup}>
                                        <label htmlFor="gate-name" className={styles.formLabel}>Name *</label>
                                        <input
                                            id="gate-name"
                                            type="text"
                                            name="name"
                                            placeholder="Your name"
                                            required
                                            className={styles.formInput}
                                        />
                                        <ValidationError prefix="Name" field="name" errors={formState.errors} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="gate-email" className={styles.formLabel}>Email *</label>
                                        <input
                                            id="gate-email"
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            required
                                            className={styles.formInput}
                                        />
                                        <ValidationError prefix="Email" field="email" errors={formState.errors} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="gate-message" className={styles.formLabel}>Message (optional)</label>
                                        <textarea
                                            id="gate-message"
                                            name="message"
                                            placeholder="Any questions or comments?"
                                            rows={3}
                                            className={styles.formTextarea}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formState.submitting}
                                        className={styles.unlockBtn}
                                    >
                                        {formState.submitting ? 'Unlocking...' : 'Unlock and Continue Reading'}
                                    </button>
                                </form>
                            )}

                            <button
                                onClick={() => setShowGate(false)}
                                className={styles.backBtn}
                            >
                                ← Back to preview
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className={styles.controls}>
                <button
                    onClick={prevPage}
                    disabled={currentPage <= 1}
                    className={styles.navBtn}
                >
                    ← Previous
                </button>

                <div className={styles.pageInfo}>
                    {!isUnlocked && totalPages > previewPages ? (
                        <span className={styles.previewBadge}>
                            Preview (Page {currentPage} of {previewPages} • {totalPages} total)
                        </span>
                    ) : (
                        <span className={styles.pageText}>Page {currentPage} of {totalPages}</span>
                    )}
                </div>

                {isOnLastPreviewPage ? (
                    <button
                        onClick={handleUnlockClick}
                        className={styles.unlockNavBtn}
                    >
                        🔓 Unlock More
                    </button>
                ) : (
                    <button
                        onClick={nextPage}
                        disabled={!canGoNext}
                        className={styles.navBtn}
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );
}
