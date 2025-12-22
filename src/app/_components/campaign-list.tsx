
"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function CampaignList() {
    const [campaigns] = api.campaign.getAll.useSuspenseQuery();

    if (campaigns.length === 0) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No campaigns found. Contact support to set up your first campaign.</p>
            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
                <div
                    key={campaign.id}
                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="p-1.5">
                        <div className="bg-slate-50 rounded-2xl p-6 mb-4 relative overflow-hidden group-hover:bg-blue-50/30 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xl font-bold text-blue-600 transition-transform group-hover:scale-110">
                                    {campaign.brand[0]}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${campaign.status === 'Active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {campaign.status}
                                </span>
                            </div>

                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">{campaign.brand}</span>
                            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{campaign.name}</h3>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        +5
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-slate-900 leading-none">
                                        {formatNumber(campaign._count.reviews)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Reviews</span>
                                </div>
                            </div>

                            <Link
                                href={`/campaign/${campaign.id}`}
                                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-2xl transition-all hover:bg-black hover:shadow-lg active:scale-[0.98]"
                            >
                                Manage Campaign
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
