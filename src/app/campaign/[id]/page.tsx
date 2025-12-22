
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";

import { WidgetGrid } from "../../_components/widget-grid";
import { Sidebar } from "../../_components/sidebar";

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
                                                <h2 className="text-xl font-bold text-slate-900">Your Widgets</h2>
                                                <p className="text-sm text-slate-500 font-medium">Embed these on your landing pages</p>
                                            </div>
                                            <WidgetGrid campaignId={id} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Quick Stats Card */}
                                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20">
                                            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Live Insights
                                            </h3>

                                            <div className="space-y-8">
                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Reviews</span>
                                                        <span className="text-2xl font-black">{campaign._count.reviews}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" style={{ width: '75%' }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Rating</span>
                                                        <span className="text-2xl font-black text-yellow-400">4.8</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-xl">★</span>)}
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-slate-800">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
                                                        <span className="text-green-400 font-black">+12.4%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                                        Users who see reviews are 3x more likely to purchase after sampling.
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
