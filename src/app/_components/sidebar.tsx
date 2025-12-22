
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Dashboard",
            href: "/",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: "Campaigns",
            href: "/#campaigns",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            name: "Analytics",
            href: "/#analytics",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: "Widgets",
            href: "/#widgets",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
        },
        {
            name: "Settings",
            href: "/#settings",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">F</div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Freestand</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${pathname === item.href
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <span className={`${pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
                            {item.icon}
                        </span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-900 mb-1">Growth Plan</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-3">6,500 / 10,000 sampling units used this month.</p>
                    <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </aside>
    );
}
