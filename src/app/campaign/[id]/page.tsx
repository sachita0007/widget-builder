import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { WidgetGrid } from "../../_components/widget-grid";
import { DashboardHeader } from "../../_components/dashboard-header";

export default async function CampaignPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const breadcrumbs = [
    { label: "Campaigns", href: "/" },
    { label: id },
  ];

  return (
    <HydrateClient>
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader breadcrumbs={breadcrumbs} />

        <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{id}</h2>
              <p className="text-gray-500 mt-1">
                Manage widgets for this campaign.
              </p>
            </div>
            <Link
              href={`/campaign/${id}/create-widget`}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Widget
            </Link>
          </div>

          <WidgetGrid campaignId={id} />
        </main>
      </div>
    </HydrateClient>
  );
}
