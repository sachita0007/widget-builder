
"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function WidgetGrid({ campaignId }: { campaignId: string }) {
    // Ideally use a specific procedure to get widgets by campaign, but getById included them.
    // We can also make a specific one. Let's use getById for now if it's cached/hydrated, or we added widgets relation there.
    // Actually, let's look at what we fetched. campaign.getById fetches widgets.

    // However, simple approach:
    const [campaign] = api.campaign.getById.useSuspenseQuery({ id: campaignId });
    const widgets = campaign?.widgets || [];

    if (widgets.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center border-dashed border-2">
                <div className="mb-4 text-gray-300">
                    {/* Icon placeholder */}
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first widget to start showcasing reviews on your website.</p>
                <Link
                    href={`/campaign/${campaignId}/create-widget`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                >
                    Create Widget
                </Link>
            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {widgets.map((widget) => (
                <div key={widget.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="aspect-[16/10] bg-slate-50 relative flex items-center justify-center border-b border-gray-100 group-hover:bg-blue-50/50 transition-colors overflow-hidden">
                        {/* Decorative background for preview */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #475569 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
                                {widget.template === 'GOOGLE' && <span className="text-2xl">🔍</span>}
                                {widget.template === 'AGGREGATED' && <span className="text-2xl">📊</span>}
                                {widget.template === 'IMAGE' && <span className="text-2xl">🖼️</span>}
                                {widget.template === 'AI_GEN' && <span className="text-2xl">🤖</span>}
                            </div>
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                                {widget.template} Template
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{widget.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Updated {new Date(widget.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/widget/${widget.id}/edit`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-2xl text-xs font-bold transition-all hover:bg-black hover:shadow-lg active:scale-[0.98]"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Customize
                            </Link>
                            <button
                                className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(`<script src="https://app.freestand.in/widget/${widget.id}.js"></script>`);
                                    alert("Embed code copied to clipboard!");
                                }}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Code
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
