
"use client";

import { api } from "~/trpc/react";
import { useRef, useEffect } from "react";
import {
    AggregatedTemplate,
    AdvancedReviewTemplate,
    ImageTemplate,
    AIGenTemplate
} from "./widget-templates";

export default function EmbedViewer({ id }: { id: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: widget, isLoading, error } = api.widget.getPublicById.useQuery({ id });

    // Auto-resize logic
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = Math.ceil(entry.contentRect.height + 40); // add some padding
                window.parent.postMessage({
                    type: "freestand-resize",
                    widgetId: id,
                    height: height
                }, "*");
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [id, widget]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !widget) {
        return (
            <div className="p-8 text-center text-red-500 bg-white rounded-2xl border border-dashed border-red-200">
                <p>Widget not found or unable to load.</p>
            </div>
        );
    }

    const { template, settings, campaign } = widget;
    const reviews = campaign?.reviews || [];

    // Default dummy reviews if none exist
    const DUMMY_REVIEWS = [
        { rating: 5, reviewer: "Sarah Jenkins", text: "Absolutely love this product! It has completely changed my daily routine for the better. Highly recommended to everyone who wants quality." },
        { rating: 5, reviewer: "Michael Chen", text: "Great quality and fast shipping. The customer service team was also super helpful when I had a question about the delivery." },
        { rating: 4, reviewer: "Jessica Parker", text: "Very good value for the price. I deducted one star because the packaging was slightly damaged, but the product was fine." },
        { rating: 5, reviewer: "David Rodriguez", text: "Exceeded my expectations. I will definitely be a returning customer. Five stars all the way for this amazing experience!" }
    ];

    const displayReviews = reviews.length > 0 ? reviews : DUMMY_REVIEWS;
    const config = settings as any;

    const fontClass = config.fontStyle === 'serif' ? 'font-serif' : config.fontStyle === 'mono' ? 'font-mono' : 'font-sans';

    const props = {
        campaignId: widget.campaignId,
        reviews: displayReviews,
        config,
        fontClass
    };

    return (
        <div ref={containerRef} className="w-full bg-transparent overflow-hidden">
            <div className="w-full max-w-7xl mx-auto py-4">
                {template === "AGGREGATED" && <AggregatedTemplate {...props} />}
                {template === "GOOGLE" && <AdvancedReviewTemplate {...props} />}
                {template === "IMAGE" && <ImageTemplate {...props} />}
                {template === "AI_GEN" && <AIGenTemplate {...props} />}
            </div>
        </div>
    );
}
