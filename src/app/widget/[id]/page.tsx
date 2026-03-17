
import EmbedViewer from "~/app/_components/embed-viewer";

export default async function PublicWidgetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="w-full h-full bg-transparent">
            <EmbedViewer id={id} />
        </div>
    );
}
