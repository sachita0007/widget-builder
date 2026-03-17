
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
        cardBorderColor?: string;
        cardShadowColor?: string;
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


    // Dummy data with Indian names (temporary)
    const DUMMY_REVIEWS = [
        { rating: 5, reviewer: "Priya Sharma", text: "Really happy with this product. My dog finishes every meal now and seems much more energetic throughout the day.", createdAt: "2026-03-12T10:30:00Z" },
        { rating: 5, reviewer: "Rahul Verma", text: "Switched from another brand last month. The quality difference is very noticeable. Will keep buying this.", createdAt: "2026-03-10T14:15:00Z" },
        { rating: 4, reviewer: "Ananya Gupta", text: "Good product overall. Packaging could be better but the food itself is great. My pet loves it.", createdAt: "2026-03-08T09:45:00Z" },
        { rating: 5, reviewer: "Vikram Singh", text: "Best dog food we have tried so far. No stomach issues at all after the switch. That was my biggest concern.", createdAt: "2026-03-05T16:20:00Z" },
        { rating: 5, reviewer: "Neha Patel", text: "Simple, clean ingredients. That matters a lot to us. Our vet also recommended this brand specifically.", createdAt: "2026-03-03T11:00:00Z" },
        { rating: 4, reviewer: "Arjun Reddy", text: "Solid quality for the price. Been using it for three weeks and my dog has had no complaints. Would recommend.", createdAt: "2026-02-28T13:30:00Z" },
        { rating: 5, reviewer: "Kavitha Nair", text: "My two dogs absolutely love this. I have tried many brands and this is the one they both eat without fuss.", createdAt: "2026-02-25T08:10:00Z" },
        { rating: 5, reviewer: "Rohan Mehta", text: "Great texture and smell. Even our picky eater goes through the bowl in minutes. Very impressed.", createdAt: "2026-02-20T17:45:00Z" },
        { rating: 4, reviewer: "Simran Dhurla", text: "Switched from home food and honestly it has been much more convenient. The dogs seem healthier too.", createdAt: "2026-02-15T12:00:00Z" },
        { rating: 5, reviewer: "Aditya Joshi", text: "Ordered twice already. Consistent quality both times. Delivery was also quick and well packed.", createdAt: "2026-02-10T10:20:00Z" },
        { rating: 5, reviewer: "Meera Krishnan", text: "Our golden retriever has sensitive skin and this food has really helped. Coat looks shinier now.", createdAt: "2026-02-05T15:30:00Z" },
        { rating: 4, reviewer: "Sanjay Deshmukh", text: "Good value for money. Not the cheapest but you can tell the ingredients are better than most options.", createdAt: "2026-01-30T09:00:00Z" },
        { rating: 5, reviewer: "Pooja Iyer", text: "Finally found something that works for our puppy. She eats it happily and digestion has been smooth.", createdAt: "2026-01-25T14:40:00Z" },
        { rating: 3, reviewer: "Bhavya Chauhan", text: "Decent product. My dog eats it fine but I expected a bit more variety in flavours at this price.", createdAt: "2026-01-20T11:15:00Z" },
        { rating: 5, reviewer: "Manish Tiwari", text: "Recommended by a friend and now I see why. Top quality food and my lab has never been this active.", createdAt: "2026-01-15T16:50:00Z" },
        { rating: 5, reviewer: "Shashank Kumar", text: "Really happy with this product. My dog finishes every meal now. Will definitely continue buying.", createdAt: "2026-01-10T08:30:00Z" },
        { rating: 4, reviewer: "Divya Rao", text: "Good ingredients list and my dog enjoys the taste. Only wish they had a larger pack option available.", createdAt: "2026-01-05T13:00:00Z" },
        { rating: 5, reviewer: "Karthik Menon", text: "Vet approved and dog approved. What more can you ask for? Highly recommend to all pet parents.", createdAt: "2025-12-28T10:10:00Z" },
        { rating: 2, reviewer: "Ritu Saxena", text: "My dog did not take to this food at all. Had to mix it with other food to get him to eat it.", createdAt: "2025-12-20T15:25:00Z" },
        { rating: 5, reviewer: "Amit Chopra", text: "Premium quality at a fair price. Both our dogs eat this and we have noticed better energy levels.", createdAt: "2025-12-15T09:45:00Z" }
    ];

    let displayReviews: any[] = DUMMY_REVIEWS;

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
