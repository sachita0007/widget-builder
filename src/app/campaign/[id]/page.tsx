
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";

import { WidgetGrid } from "../../_components/widget-grid";
import { Sidebar } from "../../_components/sidebar";

const CHART_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#2563EB', '#4F46E5', '#7C3AED', '#A855F7'];

export default async function CampaignPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const campaign = await api.campaign.getById({ id });

        if (!campaign) {
            notFound();
        }

        return (
            <HydrateClient>
                <div className="flex min-h-screen bg-slate-50">
                    <Sidebar />

                    <main className="flex-1 ml-64 flex flex-col">
                        {/* Header / Breadcrumbs */}
                        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
                                <span className="text-gray-300">/</span>
                                <span className="text-sm text-gray-900 font-bold">{campaign.name}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    href={`/campaign/${id}/create-widget`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Widget
                                </Link>
                            </div>
                        </header>

                        <div className="p-8 pb-16 overflow-y-auto">
                            <div className="max-w-6xl mx-auto space-y-10">

                                {/* Campaign Info & Stats Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-40"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {campaign.status}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{campaign.brand}</span>
                                                </div>
                                                <h1 className="text-4xl font-black text-slate-900 mb-4">{campaign.name}</h1>
                                                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                                                    Performance overview and widget management for your physical sampling campaign.
                                                    Currently collecting verified reviews from target personas.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-slate-900">Campaign Insights</h2>
                                                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg uppercase tracking-widest">Real-time Data</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Rating</div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-3xl font-black text-slate-800">{campaign.insights?.avgRating ?? 0}</span>
                                                        <span className="text-yellow-400 text-lg mb-1">★</span>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                                        <span className="text-[10px] font-bold text-slate-500">{(campaign.insights?.totalResponses ?? 0).toLocaleString()} Feedback Records</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trial Rate</div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-3xl font-black text-slate-800">{campaign.insights?.trialRate ?? 0}%</span>
                                                        <span className="text-blue-500 text-lg mb-1">↑</span>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                                        <span className="text-[10px] font-bold text-slate-500">Verified Trial Engagement</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase Intent</div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-3xl font-black text-slate-800">{campaign.insights?.purchaseIntent ?? 0}%</span>
                                                        <span className="text-green-500 text-lg mb-1">✓</span>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                                        <span className="text-[10px] font-bold text-slate-500">Conversion Readiness</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Insights</div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-3xl font-black text-slate-800">{Object.keys(campaign.insights?.catAgeDistribution ?? {}).length}</span>
                                                        <span className="text-orange-500 text-lg mb-1">📊</span>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                                        <span className="text-[10px] font-bold text-slate-500">Demographic Data Points</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                                {/* Cat Age Breakdown */}
                                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Demographic Distribution</h3>
                                                    <div className="space-y-6">
                                                        {Object.entries(campaign.insights?.catAgeDistribution ?? {}).map(([label, value]: [string, any], i) => {
                                                            const total = Object.values(campaign.insights?.catAgeDistribution ?? {}).reduce((a: any, b: any) => a + b, 0) as number;
                                                            const pct = Math.round((value / total) * 100);
                                                            return (
                                                                <div key={label} className="space-y-2">
                                                                    <div className="flex justify-between text-[11px] font-bold">
                                                                        <span className="text-slate-600 uppercase tracking-wider">{label}</span>
                                                                        <span className="text-slate-900">{pct}% ({value.toLocaleString()})</span>
                                                                    </div>
                                                                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                                        <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Competitive Share */}
                                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Brand Landscape Share</h3>
                                                    <div className="space-y-6">
                                                        {Object.entries(campaign.insights?.brandLandscape ?? {}).map(([name, value]: [string, any], i) => {
                                                            const max = Math.max(...Object.values(campaign.insights?.brandLandscape ?? {}) as number[]);
                                                            const pct = (value / max) * 100;
                                                            return (
                                                                <div key={name} className="flex items-center gap-4">
                                                                    <span className="w-20 text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate">{name}</span>
                                                                    <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                                        <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[(i + 3) % CHART_COLORS.length] }}></div>
                                                                    </div>
                                                                    <span className="w-12 text-[10px] font-black text-slate-900 text-right">{value.toLocaleString()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2zm0 4h2v6h-2z" />
                                                    </svg>
                                                </div>
                                                <div className="relative z-10">
                                                    <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                                        <span className="text-yellow-400">💡</span>
                                                        High-Value Conversion Opportunity
                                                    </h3>
                                                    <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl mb-6 font-medium">
                                                        Identified <span className="text-white font-black underline decoration-yellow-400 decoration-4 underline-offset-4">{(campaign.insights?.foodTypeBreakdown?.['Home Cooked Food'] ?? 0).toLocaleString()} users</span> currently feeding home-cooked food. These are high-priority targets for Whiskas penetration.
                                                    </p>
                                                    <div className="flex gap-4">
                                                        <div className="px-4 py-2 bg-indigo-800/50 rounded-2xl border border-indigo-700/50 text-xs font-bold uppercase tracking-widest text-indigo-200">
                                                            Growth Momentum: +86%
                                                        </div>
                                                        <div className="px-4 py-2 bg-indigo-800/50 rounded-2xl border border-indigo-700/50 text-xs font-bold uppercase tracking-widest text-indigo-200">
                                                            Priority: Strategic
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-10">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-xl font-bold text-slate-900">Your Widgets</h2>
                                                    <p className="text-sm text-slate-500 font-medium">Embed these on your landing pages</p>
                                                </div>
                                                <WidgetGrid campaignId={id} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Quick Stats Card */}
                                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20">
                                            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Campaign Health
                                            </h3>

                                            <div className="space-y-8">
                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Responses</span>
                                                        <span className="text-2xl font-black">{(campaign.insights?.totalResponses ?? 0).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" style={{ width: '85%' }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Rating</span>
                                                        <span className="text-2xl font-black text-yellow-400">{campaign.insights?.avgRating ?? 0}</span>
                                                    </div>
                                                    <div className="flex gap-1 text-yellow-400 text-xl">
                                                        {[1, 2, 3, 4, 5].map((i: number) => (
                                                            <span key={i} className={i <= Math.floor(campaign.insights?.avgRating ?? 0) ? "text-yellow-400" : "text-slate-700"}>★</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-slate-800">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Purchase Intent</span>
                                                        <span className="text-green-400 font-black">{campaign.insights?.purchaseIntent ?? 0}%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                                        Consistent growth across all verified sampling touchpoints.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personas Card */}
                                        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                                                Target Personas
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500">{campaign._count.personas}</span>
                                            </h3>
                                            <div className="space-y-3">
                                                {campaign.personas?.slice(0, 3).map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                        <span className="text-xs font-bold text-slate-700 truncate mr-2">{p.label}</span>
                                                        <span className="text-[10px] font-black text-blue-600">{p.rating}★</span>
                                                    </div>
                                                ))}
                                                {campaign.personas && campaign.personas.length > 3 && (
                                                    <button className="w-full text-center py-2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition uppercase tracking-widest">
                                                        + View {campaign.personas.length - 3} More
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </HydrateClient>
        );
    } catch (e) {
        notFound();
    }
}
