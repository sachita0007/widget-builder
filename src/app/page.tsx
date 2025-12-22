
import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

import { CampaignList } from "./_components/campaign-list";
import { Sidebar } from "./_components/sidebar";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.campaign.getAll.prefetch();
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />

        <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xl shadow-blue-500/20">F</div>
            <span className="font-bold text-2xl tracking-tight">Freestand</span>
          </div>
          <Link href="/api/auth/signin" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-lg hover:translate-y-[-1px]">
            Log in
          </Link>
        </nav>

        <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-8 animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Now supporting 100+ sampling brands
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500">
            Verified Sampling <br />
            <span className="text-blue-600">Feedback Platform</span>
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 leading-relaxed mb-10">
            Convert your physical product samples into powerful digital trust.
            Automate verified review collection and showcase them anywhere.
          </p>
          <div className="flex gap-4">
            <Link href="/api/auth/signin" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95">
              Get Started for Free
            </Link>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
              Watch Demo
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <HydrateClient>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 ml-64 flex flex-col">

          {/* Dashboard Header */}
          <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-8 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-900">Dashboard</h1>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-500 font-medium">Overview</span>
              </div>

              <div className="hidden md:flex flex-1 max-w-md relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns, products or insights..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{session.user.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Enterprise Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 border-2 border-white">
                  {session.user.name?.[0]}
                </div>
                <Link href="/api/auth/signout" className="text-slate-400 hover:text-red-500 transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Scrollable Content */}
          <div className="p-8 pb-16">
            <div className="max-w-6xl mx-auto space-y-10">

              {/* Welcome Banner */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-40"></div>

                <div className="flex-1 relative z-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome back, {session.user.name?.split(' ')[0]}! 👋</h2>
                  <p className="text-gray-500 text-lg max-w-lg mb-6 leading-relaxed">
                    Your campaigns are performing 12% better this week.
                    Manage your sampling projects and embeddable widgets below.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-4 py-2 bg-blue-50 rounded-xl text-blue-700 font-bold text-sm">
                      4 Active Campaigns
                    </div>
                    <div className="px-4 py-2 bg-green-50 rounded-xl text-green-700 font-bold text-sm">
                      1,240 Total Reviews
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block relative z-10 w-48 h-48">
                  <div className="absolute inset-0 bg-blue-100 rounded-3xl rotate-6"></div>
                  <div className="absolute inset-0 bg-blue-600 rounded-3xl -rotate-3 flex items-center justify-center shadow-xl">
                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campaign Section */}
              <div id="campaigns" className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Your Campaigns</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Manage and monitor your physical sampling feedback.</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Campaign
                  </button>
                </div>

                <CampaignList />
              </div>

            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
