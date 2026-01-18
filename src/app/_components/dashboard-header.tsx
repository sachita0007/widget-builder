
"use client";

import Link from "next/link";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface DashboardHeaderProps {
    userName: string | null | undefined;
    breadcrumbs?: Breadcrumb[];
}

export function DashboardHeader({ userName, breadcrumbs }: DashboardHeaderProps) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-10 flex-1">
                <div className="flex flex-col">
                    <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">
                        {breadcrumbs?.[breadcrumbs.length - 1]?.label ?? "Dashboard"}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href="/" className="hover:text-blue-500 transition-colors">freestand</Link>
                        {breadcrumbs ? (
                            breadcrumbs.map((bc, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-gray-200">/</span>
                                    {bc.href ? (
                                        <Link href={bc.href} className="hover:text-blue-500 transition-colors">
                                            {bc.label}
                                        </Link>
                                    ) : (
                                        <span className="text-blue-500">{bc.label}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <>
                                <span className="text-gray-200">/</span>
                                <span className="text-blue-500">Overview</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="hidden md:flex flex-1 max-w-md relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search campaigns, products or insights..."
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none rounded-2xl text-sm transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-100">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                    </button>
                </div>

                <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-gray-900 leading-none mb-1">{userName}</p>
                        <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Enterprise Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 border-2 border-white transform transition-transform hover:scale-105 cursor-pointer">
                        {userName?.[0]}
                    </div>
                    <Link href="/api/auth/signout" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
}
