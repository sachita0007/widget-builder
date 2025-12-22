
"use client";

import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

// Google SVG Icon as constant
const GOOGLE_G_SVG = (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// Helper for resilient images
function ImageWithFallback({ src, alt, className, useGoogleFallback = false }: { src: string, alt: string, className?: string, useGoogleFallback?: boolean }) {
    const [error, setError] = useState(false);

    // Reset error when src changes
    useEffect(() => {
        setError(false);
    }, [src]);

    if (error && useGoogleFallback) {
        return <div className={className}>{GOOGLE_G_SVG}</div>;
    }

    return (
        <img
            src={error ? "https://via.placeholder.com/400?text=Freestand" : src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}

// Types for props
interface WidgetPreviewProps {
    widgetId: string;
    template: string;
    config: {
        primaryColor: string;
        secondaryColor: string;
        fontStyle: string;
        showBadge: boolean;
        cornerRadius: string;
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

    const [reviews] = api.review.getByCampaign.useSuspenseQuery({ campaignId: widget.campaignId });


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

    const displayReviews = (reviews && reviews.length > 0) ? reviews : DUMMY_REVIEWS;

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

// --- Sub-components for Templates ---


function AggregatedTemplate({ reviews, config, fontClass }: any) {
    const { primaryColor, secondaryColor, cornerRadius, showBadge } = config;

    // Calculate stats
    const total = reviews.length;
    const avg = total ? (reviews.reduce((a: number, b: any) => a + b.rating, 0) / total).toFixed(1) : "0.0";

    return (
        <div className={`p-8 border border-gray-100 ${cornerRadius} shadow-2xl w-full max-w-md mx-auto ${fontClass} transition-all relative overflow-hidden`} style={{ backgroundColor: secondaryColor }}>
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16" style={{ backgroundColor: primaryColor }} />

            <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl font-black tracking-tighter" style={{ color: primaryColor }}>{avg}</span>
                        <div className="text-left">
                            <div className="flex text-yellow-400 text-2xl gap-0.5 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < Math.round(Number(avg)) ? "text-yellow-400" : "text-gray-200"}>★</span>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{total} Verified Reviews</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r: any) => r.rating === star).length;
                        const pct = total ? (count / total) * 100 : 0;
                        return (
                            <div key={star} className="group flex items-center gap-4">
                                <span className="w-12 text-xs font-black text-gray-500 flex items-center gap-1 shrink-0">
                                    {star} <span className="text-gray-300">★</span>
                                </span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                        style={{ width: `${pct}%`, backgroundColor: primaryColor }}
                                    ></div>
                                </div>
                                <span className="w-10 text-[10px] font-bold text-gray-400 text-right">{Math.round(pct)}%</span>
                            </div>
                        );
                    })}
                </div>

                {showBadge && (
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white shadow-lg shadow-blue-500/20">
                                ✓
                            </div>
                            <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Freestand Verified</span>
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full">
                            <span className="text-[10px] font-black text-green-600 uppercase">100% Authentic</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AdvancedReviewTemplate({ reviews, config, fontClass }: any) {
    const { primaryColor, secondaryColor, cornerRadius, showBadge, layoutType = 'GRID', gridCols = 3, gridRows = 2, infiniteScroll = false } = config;
    const avg = reviews.length ? (reviews.reduce((a: number, b: any) => a + b.rating, 0) / reviews.length).toFixed(1) : "0.0";

    const displayCount = layoutType === 'GRID' ? (gridCols * gridRows) : reviews.length;
    const displayedReviews = reviews.slice(0, displayCount);

    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    }[gridCols as 1 | 2 | 3 | 4 | 5 | 6] || 'grid-cols-3';

    return (
        <div className={`w-full mx-auto ${fontClass}`}>
            {/* Integrated Summary Section */}
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">{avg}</div>
                        <div className="flex text-yellow-400 gap-0.5 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < Math.round(Number(avg)) ? "text-yellow-400" : "text-gray-200"}>★</span>
                            ))}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Overall Sentiment</div>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-100/80"></div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight text-center md:text-left">Verified Customer Feedback</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center md:text-left mt-1">Based on {reviews.length} independent reviews</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {layoutType === 'CAROUSEL' && (
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-gray-900">←</button>
                            <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-gray-900">→</button>
                        </div>
                    )}
                    {showBadge && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white shadow-lg shadow-blue-500/20">✓</div>
                            <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Trusted Content</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Layout Render */}
            {layoutType === 'CAROUSEL' ? (
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 -mx-2">
                    {displayedReviews.map((review: any, i: number) => (
                        <ReviewCard key={i} review={review} config={config} className="w-[300px] shrink-0" />
                    ))}
                </div>
            ) : layoutType === 'LIST' ? (
                <div className="flex flex-col gap-6">
                    {displayedReviews.map((review: any, i: number) => (
                        <ReviewCard key={i} review={review} config={config} className="w-full" />
                    ))}
                </div>
            ) : (
                <div className={`grid ${gridColsClass} gap-6`}>
                    {displayedReviews.map((review: any, i: number) => (
                        <ReviewCard key={i} review={review} config={config} />
                    ))}
                </div>
            )}

            {infiniteScroll && (
                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
                        Loading more insights...
                    </div>
                </div>
            )}
        </div>
    );
}

function ReviewCard({ review, config, className = "" }: any) {
    const { primaryColor, secondaryColor, cornerRadius } = config;
    return (
        <div
            className={`p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white relative group animate-in fade-in slide-in-from-bottom-2 duration-700 ${cornerRadius} ${className}`}
            style={{ backgroundColor: secondaryColor }}
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {review.reviewer[0]}
                    </div>
                    <div>
                        <div className="font-extrabold text-gray-900 text-sm leading-none mb-1">{review.reviewer}</div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="w-[5px] h-[5px] bg-white rounded-full"></div>
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Verified Buyer</span>
                        </div>
                    </div>
                </div>
                <div className="flex text-yellow-400 text-[10px]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={idx < review.rating ? "text-yellow-400" : "text-gray-100"}>★</span>
                    ))}
                </div>
            </div>

            <p className="text-gray-600 italic text-sm font-medium leading-relaxed flex-1">
                "{review.text}"
            </p>

            <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">2 days ago</span>
                <span className="text-xs">🛡️</span>
            </div>
        </div>
    );
}


function ImageTemplate({ reviews, config, fontClass }: any) {
    const { primaryColor, secondaryColor, cornerRadius, showBadge } = config;
    const reviewsWithImages = [
        { id: 1, name: "Maria Lopez", rating: 5, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", text: "My tabby cat absolutely loves this food. Her coat is shinier than ever!" },
        { id: 2, name: "Jonathan Doe", rating: 4, image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600", text: "Great quality ingredients. You can tell they care about nutrition." },
        { id: 3, name: "Emily Rogers", rating: 5, image: "https://images.unsplash.com/photo-1495360019602-e0019216ad74?w=600", text: "Best purchase for my kitten. She meows for it every morning!" },
    ];

    return (
        <div className={`max-w-6xl mx-auto ${fontClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviewsWithImages.map((review) => (
                    <div key={review.id} className={`group relative bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 ${cornerRadius}`} style={{ backgroundColor: secondaryColor }}>
                        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                            <ImageWithFallback src={review.image} alt="Customer photo" className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1" />

                            {/* Rating badge overlay */}
                            <div className="absolute top-4 left-4 flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-white/30"}`}>★</span>
                                ))}
                            </div>

                            {/* Verification overlay */}
                            {showBadge && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                                        🛡️
                                    </div>
                                </div>
                            )}

                            {/* Gradient bottom overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white text-sm font-medium leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-white/20 pt-4">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-black text-white bg-white/10">
                                        {review.name[0]}
                                    </div>
                                    <span className="text-white text-xs font-black uppercase tracking-widest">{review.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AIGenTemplate({ campaignId, config, fontClass }: any) {
    const { primaryColor, secondaryColor, cornerRadius, showBadge } = config;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedReview, setGeneratedReview] = useState<any>(null);
    const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

    // Fetch personas
    const [campaign] = api.campaign.getById.useSuspenseQuery({ id: campaignId });
    const personas = campaign?.personas || [];

    const generateMutation = api.review.generateAIReview.useMutation({
        onSuccess: (review) => {
            setGeneratedReview(review);
            setIsModalOpen(false);
        }
    });

    const handleGenerate = (personaId: string) => {
        setSelectedPersona(personaId);
        generateMutation.mutate({ campaignId, personaId });
    };

    return (
        <div className={`max-w-3xl mx-auto text-center ${fontClass}`}>
            {!generatedReview ? (
                <div
                    className={`p-16 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative shadow-inner overflow-hidden ${cornerRadius}`}
                    style={{ backgroundColor: secondaryColor }}
                >
                    {/* Animated background shapes */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

                    <div className="relative z-10 w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-4xl mb-8 border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default group">
                        <span className="group-hover:scale-125 transition-transform">🤖</span>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">AI Insights Engine</h3>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                        Transform your raw persona data into authentic, verified reviews using our proprietary sampling-trained AI models.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-3 px-10 py-5 text-white font-black rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span className="animate-spin-slow group-hover:rotate-45 transition-transform">✨</span>
                        Generate Magic
                    </button>
                </div>
            ) : (
                <div className={`text-left p-12 border border-gray-100 shadow-2xl relative overflow-hidden group transition-all duration-700 ${cornerRadius}`} style={{ backgroundColor: secondaryColor }}>
                    {/* Magic gradient border */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-purple-500/20">
                                <span>✨ AI Transformation</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-400 text-2xl gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={i < generatedReview.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                    ))}
                                </div>
                                <span className="font-black text-gray-900 text-xl">{generatedReview.rating}.0</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Generated Based On</div>
                            <div className="text-xs font-bold text-slate-800">{personas.find((p: any) => p.id === selectedPersona)?.label}</div>
                        </div>
                    </div>

                    <p className="text-gray-900 text-2xl leading-relaxed mb-10 font-bold tracking-tight italic">
                        "{generatedReview.text}"
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10 font-black">AI</span>
                            </div>
                            <div>
                                <div className="font-black text-gray-900 text-lg leading-none mb-1">{generatedReview.reviewer}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Sampling Recipient</div>
                            </div>
                        </div>
                        {showBadge && (
                            <div className="flex items-center gap-2 bg-green-50 px-5 py-2.5 rounded-2xl border border-green-100 shadow-sm transition-transform hover:scale-105">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Shield Protected</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setGeneratedReview(null)}
                        className="mt-10 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-black text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all uppercase tracking-widest"
                    >
                        Reset and Generate Another
                    </button>
                </div>
            )}

            {/* Persona Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-6 z-50 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] shadow-3xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/20">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Intelligence Data</h3>
                                <p className="text-sm font-medium text-slate-400">Choose a persona to fuel the AI model</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            {personas.map((persona: any) => (
                                <button
                                    key={persona.id}
                                    onClick={() => handleGenerate(persona.id)}
                                    className="w-full flex items-center justify-between p-6 bg-slate-50 border border-transparent rounded-3xl hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🎯</div>
                                        <div className="text-left">
                                            <div className="font-black text-slate-900">{persona.label}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{persona.count.toLocaleString()} Recipients</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex text-yellow-400 text-xs">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={i < persona.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                            ))}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                            →
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
