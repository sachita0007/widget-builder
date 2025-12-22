
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
    const [fontStyle, setFontStyle] = useState(initialWidget.settings?.fontStyle || "sans");
    const [showBadge, setShowBadge] = useState(initialWidget.settings?.showBadge ?? true);

    const [template, setTemplate] = useState(initialWidget.template);
    const [cornerRadius, setCornerRadius] = useState(initialWidget.settings?.cornerRadius || "rounded-xl");

    // Advanced Layout State
    const [layoutType, setLayoutType] = useState(initialWidget.settings?.layoutType || "GRID"); // GRID, LIST, CAROUSEL
    const [gridCols, setGridCols] = useState(initialWidget.settings?.gridCols || 3);
    const [gridRows, setGridRows] = useState(initialWidget.settings?.gridRows || 2);
    const [infiniteScroll, setInfiniteScroll] = useState(initialWidget.settings?.infiniteScroll ?? false);
    const [autoScroll, setAutoScroll] = useState(initialWidget.settings?.autoScroll ?? false);
    const [animationSpeed, setAnimationSpeed] = useState(initialWidget.settings?.animationSpeed || 20);

    const [hasChanges, setHasChanges] = useState(false);

    const updateWidget = api.widget.update.useMutation();

    const handleUpdate = (key: string, value: any) => {
        setHasChanges(true);
        if (key === 'primaryColor') setPrimaryColor(value);
        if (key === 'secondaryColor') setSecondaryColor(value);
        if (key === 'fontStyle') setFontStyle(value);
        if (key === 'showBadge') setShowBadge(value);
        if (key === 'template') setTemplate(value);
        if (key === 'cornerRadius') setCornerRadius(value);
        if (key === 'layoutType') setLayoutType(value);
        if (key === 'gridCols') setGridCols(value);
        if (key === 'gridRows') setGridRows(value);
        if (key === 'infiniteScroll') setInfiniteScroll(value);
        if (key === 'autoScroll') setAutoScroll(value);
        if (key === 'animationSpeed') setAnimationSpeed(value);
    };

    const handleSave = () => {
        updateWidget.mutate({
            id: widgetId,
            template,
            settings: {
                primaryColor,
                secondaryColor,
                fontStyle,
                showBadge,
                cornerRadius,
                layoutType,
                gridCols,
                gridRows,
                infiniteScroll,
                autoScroll,
                animationSpeed
            }
        }, {
            onSuccess: () => setHasChanges(false)
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
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Editor • {template}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile Preview Toggle */}
                    <button
                        onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                        className={`lg:hidden px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreviewVisible ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                    >
                        {isPreviewVisible ? 'Edit Controls' : 'Show Preview'}
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`<script src="https://app.freestand.in/widget/${widgetId}.js"></script>`);
                            alert("Embed code copied!");
                        }}
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
                {/* Left Sidebar - Customization */}
                <aside className={`w-full md:w-[320px] lg:w-[400px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl transition-all duration-300 ${isPreviewVisible ? '-translate-x-full md:translate-x-0 hidden md:flex' : 'translate-x-0 flex'
                    }`}>
                    {/* Tab Navigation */}
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
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110">
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
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configure Layout</h2>
                                        </div>

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
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Grid Columns</label>
                                                    <select
                                                        value={gridCols}
                                                        onChange={(e) => handleUpdate('gridCols', parseInt(e.target.value))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Columns</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">Visible Rows</label>
                                                    <select
                                                        value={gridRows}
                                                        onChange={(e) => handleUpdate('gridRows', parseInt(e.target.value))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                    >
                                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Rows</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                                            <div>
                                                <h3 className="text-[13px] font-bold text-slate-900">Infinite Feed Loop</h3>
                                                <p className="text-[11px] font-medium text-slate-600 mt-0.5">Continuous scroll of reviews</p>
                                            </div>
                                            <button
                                                onClick={() => handleUpdate('infiniteScroll', !infiniteScroll)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${infiniteScroll ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-300'}`}
                                            >
                                                <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition duration-200 ease-in-out ${infiniteScroll ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        {infiniteScroll && (
                                            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center justify-between p-5 bg-blue-50/30 border border-blue-100/50 rounded-3xl">
                                                    <div>
                                                        <h3 className="text-[13px] font-bold text-blue-900">Cinematic Motion</h3>
                                                        <p className="text-[11px] font-medium text-blue-400 mt-0.5">Auto-scroll through feedback</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdate('autoScroll', !autoScroll)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${autoScroll ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-300'}`}
                                                    >
                                                        <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition duration-200 ease-in-out ${autoScroll ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>

                                                {autoScroll && (
                                                    <div className="space-y-5 p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Scroll Duration</label>
                                                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{animationSpeed}s</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="5"
                                                            max="60"
                                                            step="5"
                                                            value={animationSpeed}
                                                            onChange={(e) => handleUpdate('animationSpeed', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                        />
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                            <span>High Speed</span>
                                                            <span>Cinematic</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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

                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-[3rem] text-center bg-slate-50/30">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5 text-xl">💡</div>
                                    <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Editor Pro-Tip</h4>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">Use neutral "Card Finish" colors (like Slate or Light Gray) to ensure high readability across different website themes.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Preview Area */}
                <main className={`flex-1 overflow-hidden relative bg-slate-100/30 flex flex-col transition-all duration-300 ${isPreviewVisible ? 'flex translate-x-0' : 'hidden md:flex'
                    }`}>
                    {/* Background patterns */}
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
                                        fontStyle,
                                        showBadge,
                                        cornerRadius,
                                        layoutType,
                                        gridCols,
                                        gridRows,
                                        infiniteScroll,
                                        autoScroll,
                                        animationSpeed
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
        </div>
    );
}
