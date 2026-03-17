
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { WidgetPreview } from "./widget-preview";
import Link from "next/link";

interface WidgetEditorProps {
    widgetId: string;
    initialWidget: any;
}

export function WidgetEditor({ widgetId, initialWidget }: WidgetEditorProps) {
    // State for visual customization
    const [primaryColor, setPrimaryColor] = useState(initialWidget.settings?.primaryColor || "#2563EB");
    const [secondaryColor, setSecondaryColor] = useState(initialWidget.settings?.secondaryColor || "#FFFFFF");
    const [starColor, setStarColor] = useState(initialWidget.settings?.starColor || "#FBBF24");
    const [reviewTextColor, setReviewTextColor] = useState(initialWidget.settings?.reviewTextColor || "#334155");
    const [nameColor, setNameColor] = useState(initialWidget.settings?.nameColor || "#0F172A");
    const [fontStyle, setFontStyle] = useState(initialWidget.settings?.fontStyle || "sans");
    const [showBadge, setShowBadge] = useState(initialWidget.settings?.showBadge ?? false);
    const [showAggregate, setShowAggregate] = useState(initialWidget.settings?.showAggregate ?? true);
    const [verifiedBadgeStyle, setVerifiedBadgeStyle] = useState(initialWidget.settings?.verifiedBadgeStyle || "BADGE"); // BADGE, ICON
    const [verifiedBadgeLocation, setVerifiedBadgeLocation] = useState(initialWidget.settings?.verifiedBadgeLocation || "BOTH"); // BOTH, HEADER, CARDS, NONE
    const [verifiedBadgeCardPosition, setVerifiedBadgeCardPosition] = useState(initialWidget.settings?.verifiedBadgeCardPosition || "TOP_RIGHT"); // TOP_RIGHT, TOP_LEFT, BOTTOM_RIGHT, BOTTOM_LEFT, AUTO
    const [aiIntent, setAiIntent] = useState(initialWidget.settings?.aiIntent || "TRIAL_VERDICT"); // TRIAL_VERDICT, SWITCHER, HABIT_BREAKER, DEMOGRAPHIC
    const [aiContent, setAiContent] = useState(initialWidget.settings?.aiContent || null);

    const [template, setTemplate] = useState(initialWidget.template);
    const [cornerRadius, setCornerRadius] = useState(initialWidget.settings?.cornerRadius || "rounded-xl");

    // Advanced Layout State
    const [layoutType, setLayoutType] = useState(initialWidget.settings?.layoutType || "GRID"); // GRID, LIST, CAROUSEL
    const [gridCols, setGridCols] = useState(initialWidget.settings?.gridCols || 3);
    const [gridRows, setGridRows] = useState(initialWidget.settings?.gridRows || 2);
    const [infiniteScroll, setInfiniteScroll] = useState(initialWidget.settings?.infiniteScroll ?? false);
    const [autoScroll, setAutoScroll] = useState(initialWidget.settings?.autoScroll ?? false);
    const [animationSpeed, setAnimationSpeed] = useState(initialWidget.settings?.animationSpeed || 20);
    const [visualType, setVisualType] = useState(initialWidget.settings?.visualType || "IMAGE"); // IMAGE, UGC
    const [visualLayout, setVisualLayout] = useState(initialWidget.settings?.visualLayout || "GRID"); // GRID, CAROUSEL, STORY

    // Background colors
    const [backgroundColor, setBackgroundColor] = useState(initialWidget.settings?.backgroundColor || "#F8FAFC");
    const [cardColor, setCardColor] = useState(initialWidget.settings?.cardColor || "#FFFFFF");

    // Review filters
    const [reviewSentiment, setReviewSentiment] = useState(initialWidget.settings?.reviewSentiment || "ALL"); // ALL, POSITIVE, NEGATIVE
    const [reviewLimit, setReviewLimit] = useState(initialWidget.settings?.reviewLimit || 10);
    const [dateFilter, setDateFilter] = useState(initialWidget.settings?.dateFilter || "ALL"); // ALL, 7D, 30D, 90D, 1Y

    const [hasChanges, setHasChanges] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ERROR'>('IDLE');

    const utils = api.useUtils();
    const updateWidget = api.widget.update.useMutation();
    const generateAI = api.ai.generateInsight.useMutation();

    const handleGenerateAI = () => {
        setSaveStatus('SAVING');
        generateAI.mutate({
            campaignId: initialWidget.campaignId,
            intent: aiIntent as any,
            brandName: "the brand",
            insights: {
                totalResponses: 0,
                avgRating: 0,
                catAgeDistribution: {},
                brandLandscape: {},
                foodTypeBreakdown: {},
                trialRate: 0,
            },
        }, {
            onSuccess: (data) => {
                setAiContent(data);
                setHasChanges(true);

                // Immediately save to database to ensure persistence
                updateWidget.mutate({
                    id: widgetId,
                    template,
                    settings: {
                        primaryColor,
                        secondaryColor,
                        starColor,
                        reviewTextColor,
                        nameColor,
                        fontStyle,
                        showBadge,
                        showAggregate,
                        cornerRadius,
                        layoutType,
                        gridCols,
                        gridRows,
                        infiniteScroll,
                        autoScroll,
                        animationSpeed,
                        verifiedBadgeStyle,
                        verifiedBadgeLocation,
                        verifiedBadgeCardPosition,
                        aiIntent,
                        aiContent: data,
                        visualType,
                        visualLayout,
                        backgroundColor,
                        cardColor,
                        reviewSentiment,
                        reviewLimit,
                        dateFilter
                    }
                }, {
                    onSuccess: () => {
                        void utils.widget.getById.invalidate({ id: widgetId });
                        setHasChanges(false);
                        setSaveStatus('SAVED');
                        setTimeout(() => setSaveStatus('IDLE'), 3000);
                    },
                    onError: () => setSaveStatus('ERROR')
                });
            },
            onError: () => setSaveStatus('ERROR')
        });
    };

    const handleUpdate = (key: string, value: any) => {
        setHasChanges(true);
        if (key === 'primaryColor') setPrimaryColor(value);
        if (key === 'secondaryColor') setSecondaryColor(value);
        if (key === 'starColor') setStarColor(value);
        if (key === 'reviewTextColor') setReviewTextColor(value);
        if (key === 'nameColor') setNameColor(value);
        if (key === 'fontStyle') setFontStyle(value);
        if (key === 'showBadge') setShowBadge(value);
        if (key === 'showAggregate') setShowAggregate(value);
        if (key === 'verifiedBadgeStyle') setVerifiedBadgeStyle(value);
        if (key === 'verifiedBadgeLocation') setVerifiedBadgeLocation(value);
        if (key === 'verifiedBadgeCardPosition') setVerifiedBadgeCardPosition(value);
        if (key === 'template') setTemplate(value);
        if (key === 'cornerRadius') setCornerRadius(value);
        if (key === 'layoutType') setLayoutType(value);
        if (key === 'gridCols') setGridCols(value);
        if (key === 'gridRows') setGridRows(value);
        if (key === 'infiniteScroll') setInfiniteScroll(value);
        if (key === 'autoScroll') setAutoScroll(value);
        if (key === 'animationSpeed') setAnimationSpeed(value);
        if (key === 'visualType') setVisualType(value);
        if (key === 'visualLayout') setVisualLayout(value);
        if (key === 'backgroundColor') setBackgroundColor(value);
        if (key === 'cardColor') setCardColor(value);
        if (key === 'reviewSentiment') setReviewSentiment(value);
        if (key === 'reviewLimit') setReviewLimit(value);
        if (key === 'dateFilter') setDateFilter(value);
        if (key === 'aiIntent') {
            setAiIntent(value);
            setAiContent(null); // Clear previous AI content to allow fallback or regeneration
        }
    };

    const handleSave = () => {
        updateWidget.mutate({
            id: widgetId,
            template,
            settings: {
                primaryColor,
                secondaryColor,
                starColor,
                reviewTextColor,
                nameColor,
                fontStyle,
                showBadge,
                showAggregate,
                cornerRadius,
                layoutType,
                gridCols,
                gridRows,
                infiniteScroll,
                autoScroll,
                animationSpeed,
                verifiedBadgeStyle,
                verifiedBadgeLocation,
                verifiedBadgeCardPosition,
                aiIntent,
                aiContent,
                visualType,
                visualLayout,
                backgroundColor,
                cardColor,
                reviewSentiment,
                reviewLimit,
                dateFilter
            }
        }, {
            onSuccess: () => {
                void utils.widget.getById.invalidate({ id: widgetId });
                setHasChanges(false);
                setSaveStatus('SAVED');
                setTimeout(() => setSaveStatus('IDLE'), 3000);
            },
            onError: () => setSaveStatus('ERROR')
        });
    };


    const [activeTab, setActiveTab] = useState("Layout"); // Layout, Style, Settings
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
            {/* Editor Header */}
            <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-3 md:gap-4">
                    <Link href={`/campaign/${initialWidget.campaignId}`}>
                        <button className="w-9 h-9 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                    <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold text-gray-900 truncate max-w-[200px] md:max-w-none">{initialWidget.name}</h1>
                            {hasChanges && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">Draft</span>
                            )}
                            {saveStatus === 'SAVING' && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600 animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                    Saving...
                                </span>
                            )}
                            {saveStatus === 'SAVED' && (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved
                                </span>
                            )}
                            {saveStatus === 'ERROR' && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Error
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{template} template</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                        className={`lg:hidden px-3 py-2 rounded text-xs font-medium transition-colors ${isPreviewVisible ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {isPreviewVisible ? 'Editor' : 'Preview'}
                    </button>

                    <button
                        onClick={() => setShowEmbedModal(true)}
                        className="hidden sm:flex px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium transition-colors items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="hidden md:inline">Embed</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || updateWidget.isPending}
                        className={`px-5 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${hasChanges
                            ? 'bg-blue-900 hover:bg-blue-800 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {updateWidget.isPending ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <span>{hasChanges ? 'Publish' : 'Published'}</span>
                        )}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                <aside className={`w-full md:w-[320px] lg:w-[380px] bg-white border-r border-gray-200 flex flex-col z-20 transition-all duration-300 ${isPreviewVisible ? '-translate-x-full md:translate-x-0 hidden md:flex' : 'translate-x-0 flex'}`}>
                    <div className="flex items-center border-b border-gray-200 shrink-0 px-4 pt-2">
                        {["Layout", "Style", "Settings"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                    ? 'text-blue-700'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {activeTab === "Layout" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Template</h2>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "AGGREGATED", name: "Aggregated Summary", desc: "Trust card with rating breakdown" },
                                            { id: "GOOGLE", name: "Review Feed", desc: "Modern review cards with layout options" },
                                            { id: "IMAGE", name: "Visual Showcase", desc: "Photo-first user experiences" },
                                            { id: "AI_GEN", name: "AI Insights", desc: "AI-generated persona feedback" }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => handleUpdate('template', type.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${template === type.id
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-900'
                                                    }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">{type.name}</div>
                                                    <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                                                </div>
                                                {template === type.id && (
                                                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {template === 'GOOGLE' && (
                                    <div className="space-y-4 pt-6 border-t border-gray-200">
                                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</h2>
                                        <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
                                            {[
                                                { id: 'GRID', name: 'Grid' },
                                                { id: 'LIST', name: 'List' },
                                                { id: 'CAROUSEL', name: 'Carousel' }
                                            ].map((l) => (
                                                <button
                                                    key={l.id}
                                                    onClick={() => handleUpdate('layoutType', l.id)}
                                                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${layoutType === l.id
                                                        ? 'bg-white text-blue-700 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {l.name}
                                                </button>
                                            ))}
                                        </div>

                                        {layoutType === 'GRID' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-gray-700">Columns</label>
                                                    <select
                                                        value={gridCols}
                                                        onChange={(e) => handleUpdate('gridCols', parseInt(e.target.value))}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-gray-700">Rows</label>
                                                    <select
                                                        value={gridRows}
                                                        onChange={(e) => handleUpdate('gridRows', parseInt(e.target.value))}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    >
                                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Rating summary</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">Show aggregate rating card</p>
                                            </div>
                                            <button
                                                onClick={() => handleUpdate('showAggregate', !showAggregate)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showAggregate ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${showAggregate ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Infinite scroll</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">Loop reviews continuously</p>
                                            </div>
                                            <button
                                                onClick={() => handleUpdate('infiniteScroll', !infiniteScroll)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${infiniteScroll ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${infiniteScroll ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        {infiniteScroll && (
                                            <div className="space-y-3 pl-3 border-l-2 border-blue-200">
                                                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">Auto-scroll</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">Automatic animation</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdate('autoScroll', !autoScroll)}
                                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoScroll ? 'bg-blue-600' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${autoScroll ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>

                                                {autoScroll && (
                                                    <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-xs font-medium text-gray-500">Speed</label>
                                                            <span className="text-xs font-mono font-medium text-blue-600">{animationSpeed}s</span>
                                                        </div>
                                                        <input
                                                            type="range" min="5" max="60" step="5"
                                                            value={animationSpeed}
                                                            onChange={(e) => handleUpdate('animationSpeed', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {template === 'IMAGE' && (
                                    <div className="space-y-4 pt-6 border-t border-gray-200">
                                        <div className="space-y-3">
                                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content type</h2>
                                            <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
                                                {[
                                                    { id: 'IMAGE', name: 'Images' },
                                                    { id: 'UGC', name: 'Video UGC' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => handleUpdate('visualType', t.id)}
                                                        className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${visualType === t.id
                                                            ? 'bg-white text-blue-700 shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        {t.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Display layout</h2>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: 'GRID', name: 'Grid' },
                                                    { id: 'CAROUSEL', name: 'Carousel' },
                                                    { id: 'STORY', name: 'Reels' }
                                                ].map((l) => (
                                                    <button
                                                        key={l.id}
                                                        onClick={() => handleUpdate('visualLayout', l.id)}
                                                        className={`py-2.5 rounded-lg border text-xs font-medium transition-colors ${visualLayout === l.id
                                                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {l.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {visualLayout !== 'STORY' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-gray-700">Columns</label>
                                                    <select
                                                        value={gridCols}
                                                        onChange={(e) => handleUpdate('gridCols', parseInt(e.target.value))}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    >
                                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                                {visualLayout === 'GRID' && (
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-gray-700">Rows</label>
                                                        <select
                                                            value={gridRows}
                                                            onChange={(e) => handleUpdate('gridRows', parseInt(e.target.value))}
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                        >
                                                            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {template === 'AI_GEN' && (
                                    <div className="space-y-4 pt-6 border-t border-gray-200">
                                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI intent</h2>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { id: 'TRIAL_VERDICT', name: 'Trialer\'s Verdict', desc: 'First trial analysis' },
                                                { id: 'SWITCHER', name: 'Switcher\'s Choice', desc: 'Competitor comparison' },
                                                { id: 'HABIT_BREAKER', name: 'Fresh Start', desc: 'Habit transition data' },
                                                { id: 'DEMOGRAPHIC', name: 'Lifestage Specialist', desc: 'Age-based insights' }
                                            ].map((intent) => (
                                                <button
                                                    key={intent.id}
                                                    onClick={() => handleUpdate('aiIntent', intent.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${aiIntent === intent.id
                                                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-900'
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm">{intent.name}</div>
                                                        <p className="text-xs text-gray-500 mt-0.5">{intent.desc}</p>
                                                    </div>
                                                    {aiIntent === intent.id && (
                                                        <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-blue-900 rounded-xl text-white">
                                            <p className="text-xs text-blue-200 mb-3">AI generates trust signals from your campaign data.</p>
                                            <button
                                                onClick={handleGenerateAI}
                                                disabled={generateAI.isPending}
                                                className={`w-full py-2.5 rounded-lg bg-white text-blue-900 font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 ${generateAI.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {generateAI.isPending ? (
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <>Generate with Gemini</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Style" && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand colors</h2>
                                    <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                                        {[
                                            { label: 'Accent', value: primaryColor, key: 'primaryColor' },
                                            { label: 'Secondary', value: secondaryColor, key: 'secondaryColor' },
                                        ].map((c) => (
                                            <div key={c.key} className="flex items-center justify-between p-3">
                                                <label className="text-sm font-medium text-gray-700">{c.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg border border-gray-200 relative overflow-hidden shrink-0 cursor-pointer">
                                                        <input
                                                            type="color"
                                                            value={c.value}
                                                            onChange={(e) => handleUpdate(c.key, e.target.value)}
                                                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={c.value}
                                                        onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) handleUpdate(c.key, e.target.value); }}
                                                        className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Backgrounds</h2>
                                    <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                                        {[
                                            { label: 'Widget', value: backgroundColor, key: 'backgroundColor' },
                                            { label: 'Card', value: cardColor, key: 'cardColor' },
                                        ].map((c) => (
                                            <div key={c.key} className="flex items-center justify-between p-3">
                                                <label className="text-sm font-medium text-gray-700">{c.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg border border-gray-200 relative overflow-hidden shrink-0 cursor-pointer">
                                                        <input
                                                            type="color"
                                                            value={c.value}
                                                            onChange={(e) => handleUpdate(c.key, e.target.value)}
                                                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={c.value}
                                                        onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) handleUpdate(c.key, e.target.value); }}
                                                        className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail colors</h2>
                                    <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                                        {[
                                            { label: 'Stars', value: starColor, key: 'starColor' },
                                            { label: 'Name', value: nameColor, key: 'nameColor' },
                                            { label: 'Review text', value: reviewTextColor, key: 'reviewTextColor' },
                                        ].map((c) => (
                                            <div key={c.key} className="flex items-center justify-between p-3">
                                                <label className="text-sm font-medium text-gray-700">{c.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg border border-gray-200 relative overflow-hidden shrink-0 cursor-pointer">
                                                        <input
                                                            type="color"
                                                            value={c.value}
                                                            onChange={(e) => handleUpdate(c.key, e.target.value)}
                                                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={c.value}
                                                        onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) handleUpdate(c.key, e.target.value); }}
                                                        className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Typography</h2>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'sans', name: 'Inter', desc: 'Clean & modern' },
                                            { id: 'serif', name: 'Serif', desc: 'Premium feel' },
                                            { id: 'mono', name: 'Monospace', desc: 'Technical' }
                                        ].map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => handleUpdate('fontStyle', f.id)}
                                                className={`p-3 rounded-xl border transition-colors text-left ${fontStyle === f.id
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-900'
                                                    }`}
                                            >
                                                <span className={`font-medium text-sm ${f.id === 'serif' ? 'font-serif' : f.id === 'mono' ? 'font-mono' : 'font-sans'}`}>{f.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">{f.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Corner radius</h2>
                                    <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
                                        {[
                                            { id: 'rounded-none', name: 'Sharp' },
                                            { id: 'rounded-xl', name: 'Rounded' },
                                            { id: 'rounded-3xl', name: 'Extra' }
                                        ].map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleUpdate('cornerRadius', r.id)}
                                                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${cornerRadius === r.id
                                                    ? 'bg-white text-blue-700 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {r.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Settings" && (
                            <div className="space-y-6">
                                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Verified badge</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Show trust verification shield</p>
                                        </div>
                                        <button
                                            onClick={() => handleUpdate('showBadge', !showBadge)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showBadge ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${showBadge ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    {showBadge && (
                                        <div className="space-y-4 pt-3 border-t border-gray-100">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-500">Style</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleUpdate('verifiedBadgeStyle', 'BADGE')}
                                                        className={`p-2.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1.5 ${verifiedBadgeStyle === 'BADGE' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        <div className="h-6 bg-blue-600 rounded px-2 flex items-center text-[10px] text-white font-medium">Verified</div>
                                                        <span>Badge</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdate('verifiedBadgeStyle', 'ICON')}
                                                        className={`p-2.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1.5 ${verifiedBadgeStyle === 'ICON' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">✓</div>
                                                        <span>Icon</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-500">Location</label>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {['BOTH', 'HEADER', 'CARDS', 'NONE'].map((loc) => (
                                                        <button
                                                            key={loc}
                                                            onClick={() => handleUpdate('verifiedBadgeLocation', loc)}
                                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${verifiedBadgeLocation === loc ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                                        >
                                                            {loc.charAt(0) + loc.slice(1).toLowerCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {verifiedBadgeLocation !== 'NONE' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500">Position</label>
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        {[
                                                            { id: 'TOP_LEFT', name: 'Top Left' },
                                                            { id: 'TOP_RIGHT', name: 'Top Right' },
                                                            { id: 'BOTTOM_LEFT', name: 'Bottom Left' },
                                                            { id: 'BOTTOM_RIGHT', name: 'Bottom Right' },
                                                        ].map((pos) => (
                                                            <button
                                                                key={pos.id}
                                                                onClick={() => handleUpdate('verifiedBadgeCardPosition', pos.id)}
                                                                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${verifiedBadgeCardPosition === pos.id ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                                            >
                                                                {pos.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Review filters</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Control which reviews are displayed</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500">Sentiment</label>
                                        <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
                                            {[
                                                { id: 'ALL', name: 'All' },
                                                { id: 'POSITIVE', name: 'Positive' },
                                                { id: 'NEGATIVE', name: 'Negative' }
                                            ].map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => handleUpdate('reviewSentiment', s.id)}
                                                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${reviewSentiment === s.id
                                                        ? 'bg-white text-blue-700 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500">Max reviews</label>
                                        <select
                                            value={reviewLimit}
                                            onChange={(e) => handleUpdate('reviewLimit', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        >
                                            {[5, 10, 15, 20, 50].map(n => <option key={n} value={n}>{n} reviews</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500">Date range</label>
                                        <select
                                            value={dateFilter}
                                            onChange={(e) => handleUpdate('dateFilter', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        >
                                            <option value="ALL">All Time</option>
                                            <option value="7D">Last 7 Days</option>
                                            <option value="30D">Last 30 Days</option>
                                            <option value="90D">Last 90 Days</option>
                                            <option value="1Y">Last Year</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                <main className={`flex-1 overflow-hidden relative bg-gray-100 flex flex-col transition-all duration-300 ${isPreviewVisible ? 'flex translate-x-0' : 'hidden md:flex'}`}>
                    <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#D1D5DB 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 flex items-start md:items-center justify-center">
                        <div className="w-full max-w-6xl py-4">
                            <div className="bg-white border border-gray-200 p-2 md:p-4 rounded-xl shadow-sm overflow-hidden">
                                <WidgetPreview
                                    widgetId={widgetId}
                                    template={template}
                                    config={{
                                        primaryColor,
                                        secondaryColor,
                                        starColor,
                                        reviewTextColor,
                                        nameColor,
                                        fontStyle,
                                        showBadge,
                                        cornerRadius,
                                        layoutType,
                                        gridCols,
                                        gridRows,
                                        infiniteScroll,
                                        autoScroll,
                                        animationSpeed,
                                        showAggregate,
                                        verifiedBadgeStyle,
                                        verifiedBadgeLocation,
                                        verifiedBadgeCardPosition,
                                        aiIntent,
                                        aiContent,
                                        visualType,
                                        visualLayout,
                                        backgroundColor,
                                        cardColor,
                                        reviewSentiment,
                                        reviewLimit,
                                        dateFilter
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-10 bg-white border-t border-gray-200 flex items-center justify-between px-4 md:px-6 text-xs text-gray-400 shrink-0">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span className="hidden sm:inline">Live preview</span>
                        </span>
                        <span className="text-gray-400">Widget Editor</span>
                    </div>
                </main>
            </div>

            {/* Embed Modal */}
            {showEmbedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowEmbedModal(false)}
                    ></div>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden relative z-10">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Embed widget</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Paste this snippet into your HTML.</p>
                                </div>
                                <button
                                    onClick={() => setShowEmbedModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-gray-900 rounded-lg p-4 relative group overflow-hidden">
                                <div className="font-mono text-xs leading-relaxed text-blue-300 break-all select-all">
                                    <span className="text-pink-400">&lt;script</span> <br />
                                    &nbsp;&nbsp;<span className="text-blue-400">src</span>=<span className="text-emerald-400">"{typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/{widgetId}/embed"</span> <br />
                                    &nbsp;&nbsp;<span className="text-blue-400">data-widget-id</span>=<span className="text-emerald-400">"{widgetId}"</span><br />
                                    <span className="text-pink-400">&gt;&lt;/script&gt;</span>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        const embedCode = `<script src="${window.location.origin}/api/widget/${widgetId}/embed" data-widget-id="${widgetId}"></script>`;
                                        navigator.clipboard.writeText(embedCode);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className={`px-5 py-2 rounded text-sm font-medium transition-colors ${copied
                                        ? 'bg-green-600 text-white'
                                        : 'bg-blue-900 text-white hover:bg-blue-800'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy to clipboard'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
