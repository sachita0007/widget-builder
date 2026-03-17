
"use client";

import { api } from "~/trpc/react";


import {
    AggregatedTemplate,
    AdvancedReviewTemplate,
    ImageTemplate,
    AIGenTemplate
} from "./widget-templates";

// Types for props
interface WidgetPreviewProps {
    widgetId: string;
    template: string;
    config: {
        primaryColor: string;
        secondaryColor: string;
        starColor?: string;
        reviewTextColor?: string;
        nameColor?: string;
        fontStyle: string;
        showBadge: boolean;
        cornerRadius: string;
        layoutType?: string;
        gridCols?: number;
        gridRows?: number;
        infiniteScroll?: boolean;
        autoScroll?: boolean;
        animationSpeed?: number;
        showAggregate?: boolean;
        verifiedBadgeStyle?: 'BADGE' | 'ICON';
        verifiedBadgeLocation?: 'BOTH' | 'HEADER' | 'CARDS' | 'NONE';
        verifiedBadgeCardPosition?: 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' | 'AUTO';
        aiIntent?: 'TRIAL_VERDICT' | 'SWITCHER' | 'HABIT_BREAKER' | 'DEMOGRAPHIC';
        aiContent?: any;
        visualType?: 'IMAGE' | 'UGC';
        visualLayout?: 'GRID' | 'CAROUSEL' | 'STORY';
        backgroundColor?: string;
        cardColor?: string;
        reviewSentiment?: 'ALL' | 'POSITIVE' | 'NEGATIVE';
        reviewLimit?: number;
        dateFilter?: 'ALL' | '7D' | '30D' | '90D' | '1Y';
        headerTitle?: string;
        headerFontSize?: string;
        ratingQuestionId?: string;
        reviewTextQuestionIds?: string;
    };
    isMobilePreview?: boolean;
}


export function WidgetPreview({ widgetId, template, config }: WidgetPreviewProps) {
    // Fetch widget and reviews
    const [widget] = api.widget.getById.useSuspenseQuery({ id: widgetId });

    // Add a check to prevent errors if widget is not found (though suspense should handle it)
    if (!widget) {
        return (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                <p>Widget not found or loading...</p>
            </div>
        );
    }

    const [reviews] = api.review.getByCampaign.useSuspenseQuery({
        campaignId: widget.campaignId,
        ratingQuestionId: config.ratingQuestionId,
        reviewTextQuestionIds: config.reviewTextQuestionIds,
        dateFilter: config.dateFilter,
        limit: config.reviewLimit,
    });


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

    let displayReviews: any[] = (reviews && reviews.length > 0) ? reviews : DUMMY_REVIEWS;

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

    // Determine font class based on config
    const fontClass = config.fontStyle === 'serif' ? 'font-serif' : config.fontStyle === 'mono' ? 'font-mono' : 'font-sans';

    // Pass everything to template renderers
    const props = {
        campaignId: widget.campaignId,
        reviews: displayReviews,
        config,
        fontClass
    };

    switch (template) {
        case "AGGREGATED":
            return <AggregatedTemplate {...props} />;
        case "GOOGLE":
            return <AdvancedReviewTemplate {...props} />;
        case "IMAGE":
            return <ImageTemplate {...props} />;
        case "AI_GEN":
            return <AIGenTemplate {...props} />;
        default:
            return <div>Unknown Template</div>;
    }
}
