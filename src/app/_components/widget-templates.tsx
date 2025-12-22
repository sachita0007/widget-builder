
"use client";

import { useState, useEffect } from "react";

// Google SVG Icon as constant
export const GOOGLE_G_SVG = (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// Helper for resilient images
export function ImageWithFallback({ src, alt, className, useGoogleFallback = false }: { src: string, alt: string, className?: string, useGoogleFallback?: boolean }) {
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
const SHIELD_SVG = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

export function VerifiedShield({ style = 'BADGE', tooltip = 'Verified by Freestand' }: { style?: 'BADGE' | 'ICON', tooltip?: string }) {
    if (style === 'ICON') {
        return (
            <div className="group/shield relative flex items-center justify-center">
                <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center p-1 text-white cursor-help shadow-lg shadow-blue-500/20 transition-transform hover:scale-110">
                    {SHIELD_SVG}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded whitespace-nowrap opacity-0 group-hover/shield:opacity-100 transition-opacity pointer-events-none z-50">
                    {tooltip}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20">
            <div className="w-3.5 h-3.5 flex items-center justify-center font-bold">
                {SHIELD_SVG}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tooltip}</span>
        </div>
    );
}

export function AggregatedTemplate({ reviews, config, fontClass }: any) {
    const {
        primaryColor,
        secondaryColor,
        starColor,
        nameColor,
        reviewTextColor,
        cornerRadius,
        showBadge,
        verifiedBadgeStyle = 'BADGE',
        verifiedBadgeLocation = 'BOTH',
        verifiedBadgeCardPosition = 'TOP_RIGHT'
    } = config;

    // Calculate stats
    const total = reviews.length;
    const avg = total ? (reviews.reduce((a: number, b: any) => a + b.rating, 0) / total).toFixed(1) : "0.0";

    return (
        <div className={`p-8 border border-gray-100 ${cornerRadius} shadow-2xl w-full max-w-md mx-auto ${fontClass} transition-all relative overflow-hidden`} style={{ backgroundColor: secondaryColor }}>
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16" style={{ backgroundColor: primaryColor }} />

            <div className="relative z-10">
                {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'HEADER') && showBadge !== false) && (
                    <div className={`absolute ${getPositionClasses(verifiedBadgeCardPosition)} z-20 group`}>
                        <VerifiedShield style={verifiedBadgeStyle} tooltip="Verified by Freestand" />
                    </div>
                )}

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl font-black tracking-tighter" style={{ color: primaryColor }}>{avg}</span>
                        <div className="text-left">
                            <div className="flex text-2xl gap-0.5 mb-1" style={{ color: starColor }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < Math.round(Number(avg)) ? "" : "text-gray-200"}>★</span>
                                ))}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: reviewTextColor }}>{total} Verified Reviews</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r: any) => r.rating === star).length;
                        const pct = total ? (count / total) * 100 : 0;
                        return (
                            <div key={star} className="group flex items-center gap-4">
                                <span className="w-12 text-xs font-black text-gray-700 flex items-center gap-1 shrink-0">
                                    {star} <span className="text-gray-400">★</span>
                                </span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                        style={{ width: `${pct}%`, backgroundColor: primaryColor }}
                                    ></div>
                                </div>
                                <span className="w-10 text-[10px] font-bold text-gray-600 text-right">{Math.round(pct)}%</span>
                            </div>
                        );
                    })}
                </div>

                {/* Previous location removed to avoid duplicates */}
                <div className="pt-6 border-t border-gray-100 flex justify-end items-center group">
                    <div className="px-3 py-1 bg-green-50 rounded-full">
                        <span className="text-[10px] font-black text-green-600 uppercase">100% Authentic</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AdvancedReviewTemplate({ reviews, config, fontClass }: any) {
    const {
        primaryColor,
        secondaryColor,
        starColor,
        nameColor,
        reviewTextColor,
        cornerRadius,
        showBadge,
        layoutType = 'GRID',
        gridCols = 3,
        gridRows = 2,
        infiniteScroll = false,
        autoScroll = false,
        animationSpeed = 20,
        showAggregate = true,
        verifiedBadgeStyle = 'BADGE',
        verifiedBadgeLocation = 'BOTH'
    } = config;

    const avg = reviews.length ? (reviews.reduce((a: number, b: any) => a + b.rating, 0) / reviews.length).toFixed(1) : "0.0";

    // Seamless Looper logic: Double the reviews to create a continuous loop
    const baseReviews = (reviews && reviews.length > 0) ? reviews : [];
    const reviewsToDisplay = (infiniteScroll || autoScroll) ? [...baseReviews, ...baseReviews] : baseReviews;

    const displayCount = layoutType === 'GRID' ? (gridCols * gridRows) : reviewsToDisplay.length;
    const displayedReviews = reviewsToDisplay.slice(0, displayCount);

    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    }[gridCols as 1 | 2 | 3 | 4 | 5 | 6] || 'grid-cols-3';

    return (
        <div className={`w-full mx-auto ${fontClass} relative`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes cinematic-scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes cinematic-scroll-horizontal {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-cinematic {
                    animation: cinematic-scroll ${animationSpeed}s linear infinite;
                }
                .animate-cinematic-horizontal {
                    animation: cinematic-scroll-horizontal ${animationSpeed}s linear infinite;
                }
            `}} />


            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm mb-8 overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-12">
                    {/* Left: Main Rating Info */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="text-7xl font-black tracking-tighter leading-none mb-3" style={{ color: nameColor }}>{avg}</div>
                            <div className="flex text-yellow-400 gap-1 mb-2" style={{ color: starColor }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`text-xl ${i < Math.round(Number(avg)) ? "" : "text-gray-200"}`}>★</span>
                                ))}
                            </div>
                            <div className="text-[11px] font-black uppercase tracking-widest leading-none opacity-70" style={{ color: reviewTextColor }}>Overall Rating</div>
                        </div>

                        <div className="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>

                        <div className="max-w-xs">
                            <h3 className="text-3xl font-black tracking-tight text-center sm:text-left leading-tight mb-2" style={{ color: nameColor }}>Verified Customer Feedback</h3>
                            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80" style={{ color: reviewTextColor }}>Based on {reviews.length} reviews</p>
                                {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'HEADER') && showBadge !== false) && (
                                    <VerifiedShield style={verifiedBadgeStyle} tooltip="Verified by Freestand" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Breakdown */}
                    {showAggregate && (
                        <div className="w-full sm:w-80 shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-8 sm:pt-0 sm:pl-12">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-70 text-center sm:text-left" style={{ color: reviewTextColor }}>Rating Distribution</div>
                            <div className="flex flex-col gap-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviews.filter((r: any) => r.rating === star).length;
                                    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-4 group/bar">
                                            <div className="flex items-center gap-1.5 w-7 shrink-0">
                                                <span style={{ color: reviewTextColor }} className="text-xs font-black">{star}</span>
                                                <span style={{ color: starColor }} className="text-[11px]">★</span>
                                            </div>
                                            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative border border-gray-100 shadow-inner">
                                                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 group-hover/bar:scale-y-110 shadow-sm" style={{ width: `${pct}%`, backgroundColor: primaryColor }}></div>
                                            </div>
                                            <div style={{ color: reviewTextColor }} className="w-10 text-right text-xs font-black shrink-0 opacity-90">{pct}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                layoutType === 'CAROUSEL' ? (
                    <div className="relative group/carousel overflow-hidden rounded-[2.5rem] bg-slate-50/30">
                        <div className={`${autoScroll ? 'overflow-hidden' : 'overflow-x-auto'} no-scrollbar py-8 px-2`}>
                            <div className={`flex gap-6 w-max ${autoScroll ? 'animate-cinematic-horizontal' : ''}`}>
                                {displayedReviews.map((review: any, i: number) => (
                                    <ReviewCard key={i} review={review} config={config} className="w-[300px] shrink-0" />
                                ))}
                            </div>
                        </div>
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10"></div>
                    </div>
                ) : layoutType === 'LIST' ? (
                    <div className="relative group/list overflow-hidden rounded-[2.5rem] bg-slate-50/30">
                        <div className={`max-h-[650px] ${autoScroll ? 'overflow-hidden' : 'overflow-y-auto'} no-scrollbar py-4 px-2`}>
                            <div className={`flex flex-col gap-6 ${autoScroll ? 'animate-cinematic' : ''}`}>
                                {displayedReviews.map((review: any, i: number) => (
                                    <ReviewCard key={i} review={review} config={config} className="w-full" />
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none z-10"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none z-10"></div>
                    </div>
                ) : (
                    <div className={`max-h-[850px] ${autoScroll ? 'overflow-hidden' : 'overflow-y-auto'} no-scrollbar p-2`}>
                        <div className={`${autoScroll ? 'animate-cinematic' : ''} grid ${gridColsClass} gap-6`}>
                            {displayedReviews.map((review: any, i: number) => (
                                <ReviewCard key={i} review={review} config={config} />
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

const getPositionClasses = (pos: string) => {
    switch (pos) {
        case 'TOP_LEFT': return 'top-4 left-4';
        case 'TOP_RIGHT': return 'top-4 right-4';
        case 'BOTTOM_LEFT': return 'bottom-4 left-4';
        case 'BOTTOM_RIGHT': return 'bottom-4 right-4';
        default: return 'top-4 right-4';
    }
};

export function ReviewCard({ review, config, className = "" }: any) {
    const {
        primaryColor,
        secondaryColor,
        starColor,
        reviewTextColor,
        nameColor,
        cornerRadius,
        verifiedBadgeStyle,
        verifiedBadgeLocation,
        showBadge,
        verifiedBadgeCardPosition = 'TOP_RIGHT'
    } = config;
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
                        <div className="font-extrabold text-sm leading-none mb-1" style={{ color: nameColor }}>{review.reviewer}</div>
                    </div>
                </div>
                <div className="flex text-[10px]" style={{ color: starColor }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={idx < review.rating ? "" : "text-gray-100"}>★</span>
                    ))}
                </div>
            </div>

            <p className="italic text-sm font-medium leading-relaxed flex-1" style={{ color: reviewTextColor }}>
                "{review.text}"
            </p>

            <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Verified Review</span>
            </div>

            {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'CARDS') && showBadge !== false) && (
                <div className={`absolute ${getPositionClasses(verifiedBadgeCardPosition)} z-20 transition-all duration-300 group-hover:scale-110 shadow-xl`}>
                    <VerifiedShield style={verifiedBadgeStyle} tooltip="Verified by Freestand" />
                </div>
            )}
        </div>
    );
}

export function ImageTemplate({ reviews, config, fontClass }: any) {
    const {
        primaryColor,
        secondaryColor,
        starColor,
        nameColor,
        reviewTextColor,
        cornerRadius,
        showBadge,
        verifiedBadgeStyle = 'BADGE',
        verifiedBadgeLocation = 'BOTH',
        verifiedBadgeCardPosition = 'TOP_RIGHT'
    } = config;
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

                            <div className="absolute top-4 left-4 flex gap-1" style={{ color: starColor }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`text-sm ${i < review.rating ? "" : "text-white/30"}`}>★</span>
                                ))}
                            </div>

                            {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'CARDS') && showBadge !== false) && (
                                <div className={`absolute ${getPositionClasses(verifiedBadgeCardPosition)} z-20 transition-all duration-300 group-hover:scale-110 shadow-xl`}>
                                    <VerifiedShield style={verifiedBadgeStyle} tooltip="Verified by Freestand" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white text-sm font-medium leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ color: reviewTextColor }}>
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-white/20 pt-4">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-black text-white bg-white/10">
                                        {review.name[0]}
                                    </div>
                                    <span className="text-white text-xs font-black uppercase tracking-widest" style={{ color: nameColor }}>{review.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AIGenTemplate({ reviews, config, fontClass }: any) {
    const {
        primaryColor,
        secondaryColor,
        starColor,
        nameColor,
        reviewTextColor,
        cornerRadius,
        showBadge,
        verifiedBadgeStyle = 'BADGE',
        verifiedBadgeLocation = 'BOTH',
        verifiedBadgeCardPosition = 'TOP_RIGHT'
    } = config;

    // In embed mode, we might want to skip the generation interaction if it's meant to be static
    // But for now, we'll keep it consistent.
    // Note: This template needs personas and a mutation which we'll pass if needed.
    // Simplifying for now since it's an AI preview.

    return (
        <div className={`max-w-3xl mx-auto text-center ${fontClass}`}>
            <div className={`text-left p-12 border border-gray-100 shadow-2xl relative overflow-hidden group transition-all duration-700 ${cornerRadius}`} style={{ backgroundColor: secondaryColor }}>
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="flex justify-between items-start mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-purple-500/20">
                            <span>✨ AI Transformation</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex text-2xl gap-0.5" style={{ color: starColor }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < 5 ? "" : "text-gray-200"}>★</span>
                                ))}
                            </div>
                            <span className="font-black text-xl" style={{ color: nameColor }}>5.0</span>
                        </div>
                    </div>
                </div>

                <p className="text-2xl leading-relaxed mb-10 font-bold tracking-tight italic" style={{ color: reviewTextColor }}>
                    "Our AI Engine has analyzed your customer feedback to verify authenticity and sentiment."
                </p>

                {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'HEADER') && showBadge !== false) && (
                    <div className={`absolute ${getPositionClasses(verifiedBadgeCardPosition)} z-20 group`}>
                        <VerifiedShield style={verifiedBadgeStyle} tooltip="Verified by Freestand" />
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 font-black">AI</span>
                        </div>
                        <div>
                            <div className="font-black text-lg leading-none mb-1" style={{ color: nameColor }}>AI Insights</div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: reviewTextColor }}>Verified Analysis</span>
                                {((verifiedBadgeLocation === 'BOTH' || verifiedBadgeLocation === 'CARDS') && showBadge !== false) && (
                                    <VerifiedShield style="ICON" tooltip="Verified by Freestand" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
