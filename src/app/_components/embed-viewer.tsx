
"use client";

import { api } from "~/trpc/react";
import {
    AggregatedTemplate,
    AdvancedReviewTemplate,
    ImageTemplate,
    AIGenTemplate
} from "./widget-templates";

export default function EmbedViewer({ id }: { id: string }) {
    const { data: widget, isLoading, error } = api.widget.getPublicById.useQuery({ id });

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

    const { template, settings, reviews: widgetReviews } = widget;
    const reviews = widgetReviews || [];

    // Use dummy data if no real reviews exist
    const DUMMY_REVIEWS = [
        { rating: 5, reviewer: "Sarah Jenkins", text: "Absolutely love this product! It has completely changed my daily routine for the better. Highly recommended to everyone who wants quality." },
        { rating: 5, reviewer: "Michael Chen", text: "Great quality and fast shipping. The customer service team was also super helpful when I had a question about the delivery." },
        { rating: 4, reviewer: "Jessica Parker", text: "Very good value for the price. I deducted one star because the packaging was slightly damaged, but the product was fine." },
        { rating: 5, reviewer: "David Rodriguez", text: "Exceeded my expectations. I will definitely be a returning customer. Five stars all the way for this amazing experience!" },
        { rating: 5, reviewer: "Emily Watson", text: "Simple, effective, and elegant. Exactly what I was looking for. Thank you for such a great design and functionality!" },
        { rating: 4, reviewer: "Chris Evans", text: "Solid performance. Does exactly what it says on the tin. I've been using it for a week now and no complaints." },
        { rating: 5, reviewer: "Natalie Port", text: "Beautifully crafted. You can tell a lot of thought went into this. My whole family is now using it." },
        { rating: 5, reviewer: "Tom Hardy", text: "Absolute beast of a product. Rugged, reliable, and looks great in any setting. 10/10 would buy again." },
        { rating: 4, reviewer: "Scarlett J.", text: "Impressive features. A little bit of a learning curve at first but once you get it, it's indispensable." },
        { rating: 5, reviewer: "Robert D. Jr", text: "I don't usually leave reviews, but this deserved it. Exceptional quality and attention to detail." }
    ];

    let displayReviews: any[] = reviews.length > 0 ? reviews : DUMMY_REVIEWS;
    const config = settings as any;

    // Apply review filters
    if (config.reviewSentiment === 'POSITIVE') {
        displayReviews = displayReviews.filter((r: any) => r.rating >= 4);
    } else if (config.reviewSentiment === 'NEGATIVE') {
        displayReviews = displayReviews.filter((r: any) => r.rating <= 3);
    }
    if (config.dateFilter && config.dateFilter !== 'ALL') {
        const cutoff = new Date();
        if (config.dateFilter === '7D') cutoff.setDate(cutoff.getDate() - 7);
        else if (config.dateFilter === '30D') cutoff.setDate(cutoff.getDate() - 30);
        else if (config.dateFilter === '90D') cutoff.setDate(cutoff.getDate() - 90);
        else if (config.dateFilter === '1Y') cutoff.setFullYear(cutoff.getFullYear() - 1);
        displayReviews = displayReviews.filter((r: any) => r.createdAt ? new Date(r.createdAt) >= cutoff : true);
    }
    displayReviews = displayReviews.slice(0, config.reviewLimit ?? 10);

    const fontClass = config.fontStyle === 'serif' ? 'font-serif' : config.fontStyle === 'mono' ? 'font-mono' : 'font-sans';

    const props = {
        campaignId: widget.campaignId,
        reviews: displayReviews,
        config,
        fontClass
    };

    return (
        <div className="w-full h-screen overflow-hidden" style={{ backgroundColor: config.backgroundColor || '#F8FAFC' }}>
            <div className="w-full h-full">
                {template === "AGGREGATED" && <AggregatedTemplate {...props} />}
                {template === "GOOGLE" && <AdvancedReviewTemplate {...props} />}
                {template === "IMAGE" && <ImageTemplate {...props} />}
                {template === "AI_GEN" && <AIGenTemplate {...props} />}
            </div>
        </div>
    );
}
