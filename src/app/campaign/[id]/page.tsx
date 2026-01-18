
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { WidgetGrid } from "../../_components/widget-grid";
import { Sidebar } from "../../_components/sidebar";
import { DashboardHeader } from "../../_components/dashboard-header";

const CHART_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#2563EB', '#4F46E5', '#7C3AED', '#A855F7'];

export default async function CampaignPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const campaign = await api.campaign.getById({ id });

        if (!campaign) {
            notFound();
        }

        const breadcrumbs = [
            { label: 'Campaigns', href: '/#campaigns' },
            { label: campaign.name }
        ];

        return (
            <HydrateClient>
                <div className="flex min-h-screen bg-slate-50">
                    <Sidebar />

                    <main className="flex-1 ml-64 flex flex-col">
                        <DashboardHeader userName="Admin" breadcrumbs={breadcrumbs} />

                        <div className="p-8 pb-20 overflow-y-auto">
                            <div className="max-w-6xl mx-auto space-y-12">

                                {/* Campaign Hero Section */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${campaign.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {campaign.status}
                                            </span>
                                            <div className="h-6 w-px bg-gray-100"></div>
                                            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">{campaign.brand}</span>
                                        </div>
                                        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{campaign.name}</h1>
                                        <p className="text-slate-500 text-xl leading-relaxed max-w-3xl font-medium">
                                            Manage your verified sampling campaign and generate premium feedback widgets.
                                            Real-time data synchronization across all touchpoints.
                                        </p>

                                        <div className="flex gap-4 mt-10">
                                            <Link
                                                href={`/campaign/${id}/create-widget`}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-blue-600 transition-all shadow-2xl hover:translate-y-[-2px] active:translate-y-0"
                                            >
                                                Create New Widget
                                            </Link>
                                            <button className="px-8 py-4 bg-white border border-gray-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-slate-50 transition-all flex items-center gap-2">
                                                Campaign Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-12">
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Synthesis View</h2>
                                                <span className="flex items-center gap-2 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                                    Live Feed
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                                {[
                                                    { label: 'Avg Rating', value: campaign.insights?.avgRating ?? 0, sub: `${(campaign.insights?.totalResponses ?? 0).toLocaleString()} Feedback`, icon: '★', color: 'text-yellow-500' },
                                                    { label: 'Trial Rate', value: `${campaign.insights?.trialRate ?? 0}%`, sub: 'Verified Engagement', icon: '↑', color: 'text-blue-500' },
                                                    { label: 'Purchase Intent', value: `${campaign.insights?.purchaseIntent ?? 0}%`, sub: 'Sales Readiness', icon: '✓', color: 'text-green-500' },
                                                    { label: 'Insights', value: Object.keys(campaign.insights?.catAgeDistribution ?? {}).length, sub: 'Data Points', icon: '📊', color: 'text-indigo-500' }
                                                ].map((stat, i) => (
                                                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</div>
                                                        <div className="flex items-end gap-2">
                                                            <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                                                            <span className={`${stat.color} text-lg mb-1`}>{stat.icon}</span>
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                                            <span className="text-[10px] font-black text-slate-500 tracking-tight">{stat.sub}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                                <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
                                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.25em] mb-10">Audience Segment</h3>
                                                    <div className="space-y-8">
                                                        {Object.entries(campaign.insights?.catAgeDistribution ?? {}).map(([label, value]: [string, any], i) => {
                                                            const total = Object.values(campaign.insights?.catAgeDistribution ?? {}).reduce((a: any, b: any) => a + b, 0) as number;
                                                            const pct = Math.round((value / total) * 100);
                                                            return (
                                                                <div key={label} className="space-y-3">
                                                                    <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                                                        <span>{label}</span>
                                                                        <span>{pct}%</span>
                                                                    </div>
                                                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                                                        <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
                                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.25em] mb-10">Market Share Index</h3>
                                                    <div className="space-y-8">
                                                        {Object.entries(campaign.insights?.brandLandscape ?? {}).map(([name, value]: [string, any], i) => {
                                                            const max = Math.max(...Object.values(campaign.insights?.brandLandscape ?? {}) as number[]);
                                                            const pct = (value / max) * 100;
                                                            return (
                                                                <div key={name} className="flex items-center gap-5">
                                                                    <span className="w-24 text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate">{name}</span>
                                                                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                                                        <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[(i + 3) % CHART_COLORS.length] }}></div>
                                                                    </div>
                                                                    <span className="w-12 text-[10px] font-black text-slate-900 text-right">{value.toLocaleString()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-3xl">
                                                <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-1000">
                                                    <div className="w-40 h-40 bg-blue-500 rounded-full blur-[80px]"></div>
                                                </div>
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
                                                        <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">💡</span>
                                                        Market Penetration Alpha
                                                    </h3>
                                                    <p className="text-slate-300 text-xl leading-relaxed max-w-3xl mb-10 font-medium">
                                                        Detected a significant <span className="text-white font-black underline decoration-blue-500 decoration-8 underline-offset-8">Target Switch</span> opportunity. Over <span className="text-white font-black">{(campaign.insights?.foodTypeBreakdown?.['Home Cooked Food'] ?? 0).toLocaleString()} users</span> are ready for trial.
                                                    </p>
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                                            Confidence Index: 98.4%
                                                        </div>
                                                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
                                                            Growth Potential: Extreme
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8 pt-12">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Deployment Grid</h2>
                                                    <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Active Widgets</p>
                                                </div>
                                                <WidgetGrid campaignId={id} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                Live Diagnostics
                                            </h3>

                                            <div className="space-y-10">
                                                <div>
                                                    <div className="flex justify-between items-end mb-4">
                                                        <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Total Data Syncs</span>
                                                        <span className="text-3xl font-black">{(campaign.insights?.totalResponses ?? 0).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-50 border border-gray-100 rounded-full h-3 p-0.5">
                                                        <div className="bg-blue-600 h-full rounded-full shadow-lg shadow-blue-500/30" style={{ width: '85%' }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-end mb-4">
                                                        <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Synthesis Rating</span>
                                                        <span className="text-3xl font-black text-slate-900">{campaign.insights?.avgRating ?? 0}</span>
                                                    </div>
                                                    <div className="flex gap-2 text-yellow-500 text-xl">
                                                        {[1, 2, 3, 4, 5].map((i: number) => (
                                                            <span key={i} className={i <= Math.floor(campaign.insights?.avgRating ?? 0) ? "scale-110 drop-shadow-sm" : "opacity-10 grayscale"}>★</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-10 border-t border-gray-50">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Acquisition Alpha</span>
                                                        <span className="text-green-600 text-sm font-black tracking-widest">{campaign.insights?.purchaseIntent ?? 0}% ↑</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-black uppercase tracking-widest">
                                                        Sampling penetration is exceeding sector benchmarks by 14.8%.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em] mb-8 flex items-center justify-between">
                                                Core Personas
                                                <span className="px-3 py-1 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-gray-100">{campaign._count.personas}</span>
                                            </h3>
                                            <div className="space-y-4">
                                                {campaign.personas?.slice(0, 4).map((p: any, i: number) => (
                                                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300">
                                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate mr-2">{p.label}</span>
                                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{p.count}</span>
                                                    </div>
                                                ))}
                                                {campaign.personas && campaign.personas.length > 4 && (
                                                    <button className="w-full text-center py-4 text-[10px] font-black text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-[0.3em]">
                                                        Load Analytics Subsets
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
