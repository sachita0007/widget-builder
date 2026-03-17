
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
    const [showBadge, setShowBadge] = useState(initialWidget.settings?.showBadge ?? true);
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
                        visualLayout
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
                visualLayout
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
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Editor Header */}
            <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-3 md:gap-6">
                    <Link href={`/campaign/${initialWidget.campaignId}`}>
                        <button className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                    <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-3">
                            <h1 className="text-sm md:text-xl font-black text-slate-900 tracking-tight truncate max-w-[150px] md:max-w-none">{initialWidget.name}</h1>
                            {hasChanges && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-md">Draft</span>
                            )}
                            {saveStatus === 'SAVING' && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 animate-pulse">
                                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                    Saving...
                                </span>
                            )}
                            {saveStatus === 'SAVED' && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    All Saved
                                </span>
                            )}
                            {saveStatus === 'ERROR' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                    Error Saving
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Editor • {template}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                        className={`lg:hidden px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreviewVisible ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                    >
                        {isPreviewVisible ? 'Edit Controls' : 'Show Preview'}
                    </button>

                    <button
                        onClick={() => setShowEmbedModal(true)}
                        className="hidden sm:flex px-4 md:px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden md:inline">Embed Script</span>
                        <span className="md:hidden">Code</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || updateWidget.isPending}
                        className={`min-w-[100px] md:min-w-[120px] px-4 md:px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${hasChanges
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                            : 'bg-slate-100 text-slate-500 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {updateWidget.isPending ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <span>{hasChanges ? 'Publish Changes' : 'Saved'}</span>
                        )}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                <aside className={`w-full md:w-[320px] lg:w-[400px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl transition-all duration-300 ${isPreviewVisible ? '-translate-x-full md:translate-x-0 hidden md:flex' : 'translate-x-0 flex'}`}>
                    <div className="flex p-2 gap-1 bg-slate-50 border-b border-slate-200 shrink-0">
                        {["Layout", "Style", "Settings"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
                        {activeTab === "Layout" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5 px-1">Choose Template</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: "AGGREGATED", name: "Aggregated Summary", icon: "📊", desc: "Trust card with rating breakdown" },
                                            { id: "GOOGLE", name: "High-Density Review Feed", icon: "🔍", desc: "Modern, search-engine style feedback" },
                                            { id: "IMAGE", name: "Visual Showcase", icon: "📸", desc: "Photo-first user experiences" },
                                            { id: "AI_GEN", name: "AI Insights Engine", icon: "🤖", desc: "Smart generated persona feedback" }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => handleUpdate('template', type.id)}
                                                className={`flex items-start gap-4 p-4 rounded-3xl border-2 transition-all text-left ${template === type.id
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/5'
                                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-xl shrink-0">
                                                    {type.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-900 text-sm mb-1">{type.name}</div>
                                                    <p className="text-[11px] font-medium text-slate-600 leading-tight">{type.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {template === 'GOOGLE' && (
                                    <div className="space-y-6 pt-8 border-t border-slate-200 mt-4">
                                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configure Layout</h2>
                                        <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                                            {[
                                                { id: 'GRID', name: 'Grid View', icon: '🪟' },
                                                { id: 'LIST', name: 'List Feed', icon: '📜' },
                                                { id: 'CAROUSEL', name: 'Carousel', icon: '↔️' }
                                            ].map((l) => (
                                                <button
                                                    key={l.id}
                                                    onClick={() => handleUpdate('layoutType', l.id)}
                                                    className={`flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all ${layoutType === l.id
                                                        ? 'bg-white text-blue-600 shadow-sm font-bold'
                                                        : 'text-slate-600 font-semibold hover:text-slate-800'
                                                        }`}
                                                >
                                                    <span className="text-base">{l.icon}</span>
                                                    <span className="text-[10px] uppercase tracking-wide">{l.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {layoutType === 'GRID' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Columns</label>
                                                    <select
                                                        value={gridCols}
                                                        onChange={(e) => handleUpdate('gridCols', parseInt(e.target.value))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Rows</label>
                                                    <select
                                                        value={gridRows}
                                                        onChange={(e) => handleUpdate('gridRows', parseInt(e.target.value))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                                            <div>
                                                <h3 className="text-[13px] font-bold text-slate-900">Summary Highlights</h3>
                                                <p className="text-[11px] font-medium text-slate-600 mt-0.5">Show aggregate rating card</p>
                                            </div>
                                            <button
                                                onClick={() => handleUpdate('showAggregate', !showAggregate)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${showAggregate ? 'bg-blue-600' : 'bg-slate-300'}`}
                                            >
                                                <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition ${showAggregate ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                                            <div>
                                                <h3 className="text-[13px] font-bold text-slate-900">Infinite Feed Loop</h3>
                                                <p className="text-[11px] font-medium text-slate-600 mt-0.5">Continuous scroll of reviews</p>
                                            </div>
                                            <button
                                                onClick={() => handleUpdate('infiniteScroll', !infiniteScroll)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${infiniteScroll ? 'bg-blue-600' : 'bg-slate-300'}`}
                                            >
                                                <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition ${infiniteScroll ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        {infiniteScroll && (
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between p-5 bg-blue-50/30 border border-blue-100/50 rounded-3xl">
                                                    <div>
                                                        <h3 className="text-[13px] font-bold text-blue-900">Cinematic Motion</h3>
                                                        <p className="text-[11px] font-medium text-blue-400 mt-0.5">Auto-scroll through feedback</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdate('autoScroll', !autoScroll)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${autoScroll ? 'bg-blue-600' : 'bg-slate-300'}`}
                                                    >
                                                        <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition ${autoScroll ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>

                                                {autoScroll && (
                                                    <div className="space-y-5 p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Scroll Speed</label>
                                                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{animationSpeed}s</span>
                                                        </div>
                                                        <input
                                                            type="range" min="5" max="60" step="5"
                                                            value={animationSpeed}
                                                            onChange={(e) => handleUpdate('animationSpeed', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {template === 'IMAGE' && (
                                    <div className="space-y-8 pt-8 border-t border-slate-200 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="space-y-6">
                                            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Content Type</h2>
                                            <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                                                {[
                                                    { id: 'IMAGE', name: 'Static Images', icon: '📸' },
                                                    { id: 'UGC', name: 'Video UGC', icon: '🎥' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => handleUpdate('visualType', t.id)}
                                                        className={`flex-1 py-3 flex flex-col items-center gap-1.5 rounded-xl transition-all ${visualType === t.id
                                                            ? 'bg-white text-blue-600 shadow-sm font-bold border border-slate-200/50'
                                                            : 'text-slate-600 font-semibold hover:text-slate-800'
                                                            }`}
                                                    >
                                                        <span className="text-lg">{t.icon}</span>
                                                        <span className="text-[10px] uppercase tracking-wider">{t.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Display Layout</h2>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: 'GRID', name: 'Grid', icon: '▦' },
                                                    { id: 'CAROUSEL', name: 'Carousel', icon: '↔' },
                                                    { id: 'STORY', name: 'Reels', icon: '📱' }
                                                ].map((l) => (
                                                    <button
                                                        key={l.id}
                                                        onClick={() => handleUpdate('visualLayout', l.id)}
                                                        className={`py-4 flex flex-col items-center gap-2 rounded-2xl border-2 transition-all ${visualLayout === l.id
                                                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-sm'
                                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span className="text-xl">{l.icon}</span>
                                                        <span className="text-[11px] font-black uppercase tracking-tight">{l.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {visualLayout !== 'STORY' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Gallery Columns</label>
                                                    <select
                                                        value={gridCols}
                                                        onChange={(e) => handleUpdate('gridCols', parseInt(e.target.value))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Columns</option>)}
                                                    </select>
                                                </div>
                                                {visualLayout === 'GRID' && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Gallery Rows</label>
                                                        <select
                                                            value={gridRows}
                                                            onChange={(e) => handleUpdate('gridRows', parseInt(e.target.value))}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
                                                        >
                                                            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Rows</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {template === 'AI_GEN' && (
                                    <div className="space-y-8 pt-8 border-t border-slate-200 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">AI Generation Intent</h2>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'TRIAL_VERDICT', name: 'The Trialer\'s Verdict', icon: '🧪', desc: 'Focus on 77% successful first trials' },
                                                { id: 'SWITCHER', name: 'The Switcher\'s Choice', icon: '🔄', desc: 'Why users leave Drools/Purepet' },
                                                { id: 'HABIT_BREAKER', name: 'Fresh Start Habit', icon: '🥗', desc: 'Moving from home-cooked to Whiskas' },
                                                { id: 'DEMOGRAPHIC', name: 'Lifestage Specialist', icon: '🐈', desc: 'Kitten vs Senior specialized benefits' }
                                            ].map((intent) => (
                                                <button
                                                    key={intent.id}
                                                    onClick={() => handleUpdate('aiIntent', intent.id)}
                                                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${aiIntent === intent.id
                                                        ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lg shrink-0">
                                                        {intent.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-[13px] mb-0.5">{intent.name}</div>
                                                        <p className="text-[10px] font-medium text-slate-500 leading-tight">{intent.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🤖</div>
                                            <div className="relative z-10">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Editor Intelligence</h4>
                                                <p className="text-[11px] font-medium leading-relaxed mb-6">AI will automatically generate trust signals for the widget.</p>

                                                <button
                                                    onClick={handleGenerateAI}
                                                    disabled={generateAI.isPending}
                                                    className={`w-full py-3 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 ${generateAI.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {generateAI.isPending ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <>✨ Generate with Gemini</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Style" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="space-y-6 px-1">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brand Palette</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4 block">Accent Color</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                                    <input
                                                        type="color"
                                                        value={primaryColor}
                                                        onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-900">{primaryColor}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4 block">Card Finish</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                                    <input
                                                        type="color"
                                                        value={secondaryColor}
                                                        onChange={(e) => handleUpdate('secondaryColor', e.target.value)}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-900">{secondaryColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-slate-100">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Detail Colors</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4 block">Star Color</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                                    <input
                                                        type="color"
                                                        value={starColor}
                                                        onChange={(e) => handleUpdate('starColor', e.target.value)}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-900">{starColor}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4 block">Name Color</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                                    <input
                                                        type="color"
                                                        value={nameColor}
                                                        onChange={(e) => handleUpdate('nameColor', e.target.value)}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-900">{nameColor}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group col-span-2">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4 block">Review Text Color</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                                    <input
                                                        type="color"
                                                        value={reviewTextColor}
                                                        onChange={(e) => handleUpdate('reviewTextColor', e.target.value)}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-900">{reviewTextColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-slate-100">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Typography Style</h2>
                                    <div className="grid grid-cols-1 gap-3 px-1">
                                        {[
                                            { id: 'sans', name: 'Inter Medium', desc: 'Clean, modern, and reliable' },
                                            { id: 'serif', name: 'Outfit Bold', desc: 'Premium, cinematic feel' },
                                            { id: 'mono', name: 'JetBrains Mono', desc: 'Technical and precise' }
                                        ].map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => handleUpdate('fontStyle', f.id)}
                                                className={`p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-1 ${fontStyle === f.id
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className={`font-bold text-slate-900 text-sm ${f.id === 'serif' ? 'font-serif' : f.id === 'mono' ? 'font-mono' : 'font-sans'}`}>{f.name}</span>
                                                <span className="text-[11px] font-medium text-slate-600">{f.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-slate-100">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Corner Aesthetics</h2>
                                    <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                                        {[
                                            { id: 'rounded-none', name: 'Sharp', icon: '⬚' },
                                            { id: 'rounded-xl', name: 'Rounded', icon: '▢' },
                                            { id: 'rounded-3xl', name: 'Extra', icon: '◯' }
                                        ].map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleUpdate('cornerRadius', r.id)}
                                                className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-xl transition-all ${cornerRadius === r.id
                                                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                                                    : 'text-slate-600 font-semibold hover:text-slate-800'
                                                    }`}
                                            >
                                                <span className="text-base">{r.icon}</span>
                                                <span className="text-[10px] uppercase tracking-wide">{r.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Settings" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-900 leading-none">Verification Shield</h3>
                                            <p className="text-[11px] font-medium text-slate-600 mt-2 capitalize font-semibold">Boost trust & credibility</p>
                                        </div>
                                        <button
                                            onClick={() => handleUpdate('showBadge', !showBadge)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${showBadge ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition duration-200 ease-in-out ${showBadge ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                </div>

                                {showBadge && (
                                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-slate-900">Verified Shield Style</h4>
                                                    <p className="text-[11px] font-medium text-slate-600">Choose how verification is displayed</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleUpdate('verifiedBadgeStyle', 'BADGE')}
                                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${verifiedBadgeStyle === 'BADGE' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
                                                >
                                                    <div className="w-full h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold px-2">✓ Verified</div>
                                                    <span className="text-[10px] font-bold text-slate-600">Full Badge</span>
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate('verifiedBadgeStyle', 'ICON')}
                                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${verifiedBadgeStyle === 'ICON' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">✓</div>
                                                    <span className="text-[10px] font-bold text-slate-600">Icon Only</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-slate-900">Display Location</h4>
                                                    <p className="text-[11px] font-medium text-slate-600">Where should the shield appear?</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['BOTH', 'HEADER', 'CARDS', 'NONE'].map((loc) => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => handleUpdate('verifiedBadgeLocation', loc)}
                                                        className={`px-4 py-3 rounded-xl border transition-all text-[10px] font-bold ${verifiedBadgeLocation === loc ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {verifiedBadgeLocation !== 'NONE' && (
                                            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-[13px] font-bold text-slate-900">Shield Position</h4>
                                                        <p className="text-[11px] font-medium text-slate-600">Precise corner placement</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'TOP_LEFT', name: 'Top Left' },
                                                        { id: 'TOP_RIGHT', name: 'Top Right' },
                                                        { id: 'BOTTOM_LEFT', name: 'Bottom Left' },
                                                        { id: 'BOTTOM_RIGHT', name: 'Bottom Right' },
                                                        { id: 'AUTO', name: 'Auto (Best)' }
                                                    ].map((pos) => (
                                                        <button
                                                            key={pos.id}
                                                            onClick={() => handleUpdate('verifiedBadgeCardPosition', pos.id)}
                                                            className={`px-3 py-2 rounded-xl border transition-all text-[10px] font-bold ${verifiedBadgeCardPosition === pos.id ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                                        >
                                                            {pos.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-[3rem] text-center bg-slate-50/30">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5 text-xl">💡</div>
                                    <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Editor Pro-Tip</h4>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">Use neutral "Card Finish" colors (like Slate or Light Gray) to ensure high readability across different website themes.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                <main className={`flex-1 overflow-hidden relative bg-slate-100/30 flex flex-col transition-all duration-300 ${isPreviewVisible ? 'flex translate-x-0' : 'hidden md:flex'}`}>
                    <div className="absolute inset-0 opacity-[0.4] pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#CBD5E1 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-16 flex items-start md:items-center justify-center">
                        <div className="w-full max-w-6xl animate-in zoom-in-95 duration-700 py-8">
                            <div className="bg-white/50 backdrop-blur-xl border border-white p-2 md:p-4 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
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
                                        visualLayout
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-14 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-between px-6 md:px-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shrink-0">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="hidden sm:inline">Real-time Preview Active</span>
                            <span className="sm:hidden">Live</span>
                        </span>
                        <div className="flex items-center gap-4 md:gap-8">
                            <button className="hover:text-slate-900 transition-colors">Desktop</button>
                            <button className="hidden sm:block hover:text-slate-900 transition-colors opacity-40">Tablet</button>
                            <button className="hover:text-slate-900 transition-colors opacity-40">Mobile</button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Embed Modal */}
            {showEmbedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowEmbedModal(false)}
                    ></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative z-10">
                        <div className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Embed Your Widget</h3>
                                    <p className="text-sm text-slate-500 font-semibold mt-1">Copy the snippet below to display reviews on your site.</p>
                                </div>
                                <button
                                    onClick={() => setShowEmbedModal(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-6 relative group overflow-hidden border border-slate-800 shadow-inner">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div className="font-mono text-[11px] md:text-xs leading-relaxed text-blue-300 break-all select-all">
                                    <span className="text-pink-400">&lt;script</span> <br />
                                    &nbsp;&nbsp;<span className="text-blue-400">src</span>=<span className="text-emerald-400">"{typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/{widgetId}/embed"</span> <br />
                                    &nbsp;&nbsp;<span className="text-blue-400">data-widget-id</span>=<span className="text-emerald-400">"{widgetId}"</span><br />
                                    <span className="text-pink-400">&gt;&lt;/script&gt;</span>
                                </div>

                                <button
                                    onClick={() => {
                                        const embedCode = `<script src="${window.location.origin}/api/widget/${widgetId}/embed" data-widget-id="${widgetId}"></script>`;
                                        navigator.clipboard.writeText(embedCode);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className={`absolute top-4 right-4 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all scale-95 hover:scale-100 ${copied
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy Snippet'}
                                </button>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                                    <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Step 1</h4>
                                    <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">Paste this script tag anywhere in your HTML where you want the widget to appear.</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Step 2</h4>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">The widget will automatically inject itself and adjust its height to fit the content perfectly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
