import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useWidget, useUpdateWidget, useWidgetReviews, useSeedReviews } from "@/hooks/use-widgets";
import { Button } from "@/components/ui/button";
import { ReviewWidget } from "@/components/ReviewWidget";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { WidgetEmbedCode } from "@/components/WidgetEmbedCode";
import { ChevronLeft, Save, Loader2, RefreshCw } from "lucide-react";
import { type Widget } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function WidgetEditor() {
  const [, params] = useRoute("/editor/:id");
  const id = Number(params?.id);

  const { data: widgetData, isLoading: widgetLoading } = useWidget(id);
  const { data: reviews, isLoading: reviewsLoading } = useWidgetReviews(id);
  const updateWidget = useUpdateWidget();
  const seedReviews = useSeedReviews();
  const { toast } = useToast();

  // Local state for immediate preview feedback
  const [localWidget, setLocalWidget] = useState<Widget | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync server data to local state on load
  useEffect(() => {
    if (widgetData) {
      setLocalWidget(widgetData);
    }
  }, [widgetData]);

  // Handle local updates
  const handleUpdate = (updates: Partial<Widget>) => {
    if (!localWidget) return;
    setLocalWidget({ ...localWidget, ...updates });
    setHasChanges(true);
  };

  // Persist changes
  const handleSave = () => {
    if (!localWidget) return;
    updateWidget.mutate(
      { id, ...localWidget },
      { onSuccess: () => setHasChanges(false) }
    );
  };

  if (widgetLoading || !localWidget) return <EditorLoader />;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Editor Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href={`/campaign/${id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">{localWidget.name}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className={cn("w-2 h-2 rounded-full", hasChanges ? "bg-amber-400" : "bg-green-500")} />
              {hasChanges ? "Unsaved changes" : "All changes saved"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Seed Data Button (Demo Only) */}
          {reviews && reviews.length === 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => seedReviews.mutate(id)}
              disabled={seedReviews.isPending}
              className="hidden md:flex"
            >
              {seedReviews.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Load Demo Data
            </Button>
          )}

          <WidgetEmbedCode widgetId={id} />

          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateWidget.isPending}
            className={cn("min-w-[100px] transition-all", hasChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-200 text-slate-400")}
          >
            {updateWidget.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Customization */}
        <aside className="w-[380px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 z-10">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-6">Customization</h2>
            <CustomizationPanel widget={localWidget} onChange={handleUpdate} />
          </div>
        </aside>

        {/* Right Preview Area */}
        <main className="flex-1 overflow-hidden relative bg-slate-100/50 flex flex-col">
          <div className="absolute inset-0 pattern-grid-lg opacity-5 pointer-events-none" />

          <div className="flex-1 overflow-y-auto p-8 md:p-12 flex items-center justify-center">
            {/* Widget Container - Resizable simulated environment */}
            <div className="w-full max-w-5xl bg-transparent transition-all duration-500">
              {reviewsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <ReviewWidget
                  widget={localWidget}
                  reviews={reviews || []}
                  previewMode
                />
              )}
            </div>
          </div>

          <div className="h-10 bg-white border-t border-slate-200 flex items-center justify-center text-xs text-slate-400 gap-6">
            <span>Preview Mode</span>
            <div className="w-px h-4 bg-slate-200" />
            <span>Responsive Layout</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function EditorLoader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      <p className="text-slate-500 font-medium">Loading editor...</p>
    </div>
  );
}
