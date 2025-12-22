
import { CreateWidgetForm } from "~/app/_components/create-widget-form";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <CreateWidgetForm campaignId={id} />
        </div>
    );
}
