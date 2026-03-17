
import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { WidgetEditor } from "~/app/_components/widget-editor";

export default async function EditWidgetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const widget = await api.widget.getById({ id });

        if (!widget) {
            notFound();
        }

        return (
            <HydrateClient>
                <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
                    <WidgetEditor widgetId={id} initialWidget={widget} />
                </div>
            </HydrateClient>
        );
    } catch (e) {
        notFound();
    }
}
