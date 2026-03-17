
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

    // Dummy data with Indian names (temporary)
    const DUMMY_REVIEWS = [
        { rating: 5, reviewer: "Priya Sharma", text: "Really happy with this product. My dog finishes every meal now and seems much more energetic throughout the day." },
        { rating: 5, reviewer: "Rahul Verma", text: "Switched from another brand last month. The quality difference is very noticeable. Will keep buying this." },
        { rating: 4, reviewer: "Ananya Gupta", text: "Good product overall. Packaging could be better but the food itself is great. My pet loves it." },
        { rating: 5, reviewer: "Vikram Singh", text: "Best dog food we have tried so far. No stomach issues at all after the switch. That was my biggest concern." },
        { rating: 5, reviewer: "Neha Patel", text: "Simple, clean ingredients. That matters a lot to us. Our vet also recommended this brand specifically." },
        { rating: 4, reviewer: "Arjun Reddy", text: "Solid quality for the price. Been using it for three weeks and my dog has had no complaints. Would recommend." },
        { rating: 5, reviewer: "Kavitha Nair", text: "My two dogs absolutely love this. I have tried many brands and this is the one they both eat without fuss." },
        { rating: 5, reviewer: "Rohan Mehta", text: "Great texture and smell. Even our picky eater goes through the bowl in minutes. Very impressed." },
        { rating: 4, reviewer: "Simran Dhurla", text: "Switched from home food and honestly it has been much more convenient. The dogs seem healthier too." },
        { rating: 5, reviewer: "Aditya Joshi", text: "Ordered twice already. Consistent quality both times. Delivery was also quick and well packed." },
        { rating: 5, reviewer: "Meera Krishnan", text: "Our golden retriever has sensitive skin and this food has really helped. Coat looks shinier now." },
        { rating: 4, reviewer: "Sanjay Deshmukh", text: "Good value for money. Not the cheapest but you can tell the ingredients are better than most options." },
        { rating: 5, reviewer: "Pooja Iyer", text: "Finally found something that works for our puppy. She eats it happily and digestion has been smooth." },
        { rating: 3, reviewer: "Bhavya Chauhan", text: "Decent product. My dog eats it fine but I expected a bit more variety in flavours at this price." },
        { rating: 5, reviewer: "Manish Tiwari", text: "Recommended by a friend and now I see why. Top quality food and my lab has never been this active." },
        { rating: 5, reviewer: "Shashank Kumar", text: "Really happy with this product. My dog finishes every meal now. Will definitely continue buying." },
        { rating: 4, reviewer: "Divya Rao", text: "Good ingredients list and my dog enjoys the taste. Only wish they had a larger pack option available." },
        { rating: 5, reviewer: "Karthik Menon", text: "Vet approved and dog approved. What more can you ask for? Highly recommend to all pet parents." },
        { rating: 2, reviewer: "Ritu Saxena", text: "My dog did not take to this food at all. Had to mix it with other food to get him to eat it." },
        { rating: 5, reviewer: "Amit Chopra", text: "Premium quality at a fair price. Both our dogs eat this and we have noticed better energy levels." }
    ];

    let displayReviews: any[] = DUMMY_REVIEWS;
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
