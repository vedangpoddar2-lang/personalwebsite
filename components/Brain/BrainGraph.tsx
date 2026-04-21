'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
// import { useTheme } from 'styled-components';

// Dynamically import to avoid SSR issues with Canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="graph-loader">Compiling Knowledge...</div>
});

const BrainGraph = ({ resources }: { resources: any[] }) => {
    const graphRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ w: 800, h: 400 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Prepare Graph Data
    // Nodes = Keywords + Resource Titles
    // Links = Resource -> Keyword
    const nodes: any[] = [];
    const links: any[] = [];
    const keywordMap = new Set();

    resources.forEach(res => {
        // Resource Node
        nodes.push({
            id: res._id,
            name: res.title,
            type: 'resource',
            val: 2,
            color: '#003366' // Primary Navy
        });

        // Keyword Nodes & Links
        res.keywords?.forEach((kw: string) => {
            const tag = kw.toLowerCase();
            if (!keywordMap.has(tag)) {
                nodes.push({
                    id: tag,
                    name: tag,
                    type: 'keyword',
                    val: 1,
                    color: '#ff6b6b' // Soft Salmon Accent
                });
                keywordMap.add(tag);
            }
            links.push({ source: res._id, target: tag });
        });
    });

    const data = { nodes, links };

    // Responsive Sizing
    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                setDimensions({
                    w: containerRef.current.clientWidth,
                    h: 400 // Fixed Height for the Header
                });
            }
        };
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);

    // Custom Node Rendering
    const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // padding

        // Only draw label on hover or if it's a resource
        if (node.type === 'resource' || globalScale > 1.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // White background for label
            // @ts-ignore
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);
        } else {
            // Just a dot for keywords when zoomed out
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
        }

        // Glow Effect
        if (node.type === 'resource') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = node.color;
        } else {
            ctx.shadowBlur = 0;
        }

    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '300px', background: 'transparent', overflow: 'hidden', position: 'relative' }}>
            <ForceGraph2D
                ref={graphRef}
                width={dimensions.w}
                height={dimensions.h}
                graphData={data}
                nodeLabel="name"
                nodeCanvasObject={drawNode}
                linkColor={() => 'rgba(0, 51, 102, 0.1)'} // Navy, low opacity
                backgroundColor="rgba(0,0,0,0)" // Transparent
                cooldownTicks={100}
                onNodeClick={node => {
                    // Zoom to node
                    graphRef.current?.centerAt(node.x, node.y, 1000);
                    graphRef.current?.zoom(3, 2000);
                }}
            />
            <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
                Interactive Neural Net
            </div>
        </div>
    );
};

export default BrainGraph;
