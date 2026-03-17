import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { DashboardHeader } from "./_components/dashboard-header";

const CAMPAIGNS = [
  { id: "whiskas-july-2025", name: "Whiskas July 2025", brand: "Whiskas" },
  { id: "pedigree-aug-2025", name: "Pedigree August 2025", brand: "Pedigree" },
  { id: "dove-skincare-2025", name: "Dove Skin Care 2025", brand: "Dove" },
  { id: "pepsi-summer-2025", name: "Pepsi Summer Blast", brand: "Pepsi" },
];

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />

        <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
            <p className="text-gray-500 mt-1">
              Select a campaign to manage its review widgets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaign/${campaign.id}`}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg mb-4 group-hover:bg-blue-100 transition-colors">
                  {campaign.brand[0]}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  {campaign.brand}
                </p>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {campaign.name}
                </h3>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
