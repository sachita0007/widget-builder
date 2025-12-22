import { useState } from "react";
import { type Persona } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Loader2 } from "lucide-react";
import { useGenerateAiReview, useWidgetPersonas, useSeedPersonas } from "@/hooks/use-widgets";
import { cn } from "@/lib/utils";

interface PersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: number;
  onReviewGenerated?: () => void;
}

export function PersonaModal({ open, onOpenChange, widgetId, onReviewGenerated }: PersonaModalProps) {
  const [generatingPersonaId, setGeneratingPersonaId] = useState<string | null>(null);
  const { data: personas = [], isLoading } = useWidgetPersonas(widgetId);
  const generateReview = useGenerateAiReview();
  const seedPersonas = useSeedPersonas();

  const handleGenerateReview = async (personaId: string) => {
    setGeneratingPersonaId(personaId);
    try {
      await generateReview.mutateAsync({ widgetId, personaId });
      if (onReviewGenerated) {
        onReviewGenerated();
      }
      // Keep modal open to allow generating more reviews
    } catch (error) {
      // Error is handled by the hook's toast
    } finally {
      setGeneratingPersonaId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            fill={star <= rating ? "currentColor" : "none"}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-yellow-400" : "text-slate-300"
            )}
          />
        ))}
      </div>
    );
  };

  const formatCount = (count: number) => {
    return new Intl.NumberFormat("en-US").format(count);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Loading Personas</DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (personas.length === 0 && !isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>No Personas Available</DialogTitle>
            <DialogDescription>
              No personas have been set up for this widget yet. Click the button below to load demo personas.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button
              onClick={() => seedPersonas.mutate(widgetId)}
              disabled={seedPersonas.isPending}
              className="w-full"
            >
              {seedPersonas.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading Personas...
                </>
              ) : (
                "Load Demo Personas"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Generate AI Reviews from Personas</DialogTitle>
          <DialogDescription>
            Your reviews will be generated according to the following responses captured by the claimants during the campaign.
            Click on a persona row to generate a review.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[80px] font-semibold">Persona</TableHead>
                <TableHead className="w-[120px] font-semibold">Rating</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Food Type</TableHead>
                <TableHead className="font-semibold">Cat Age</TableHead>
                <TableHead className="font-semibold">Bought From</TableHead>
                <TableHead className="font-semibold">Issue</TableHead>
                <TableHead className="text-right font-semibold">Count</TableHead>
                <TableHead className="w-[120px] font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                    No personas available
                  </TableCell>
                </TableRow>
              ) : (
                personas.map((persona) => (
                <TableRow
                  key={persona.id}
                  className={cn(
                    "cursor-pointer hover:bg-slate-50 transition-colors",
                    generatingPersonaId === persona.id && "bg-blue-50"
                  )}
                >
                  <TableCell className="font-semibold">{persona.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStars(persona.rating)}
                      <span className="text-sm text-slate-600">({persona.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell>{persona.brand}</TableCell>
                  <TableCell>{persona.foodType}</TableCell>
                  <TableCell>{persona.catAge}</TableCell>
                  <TableCell>{persona.boughtFrom}</TableCell>
                  <TableCell>{persona.issue}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCount(persona.count || 0)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateReview(persona.id);
                      }}
                      disabled={generatingPersonaId === persona.id}
                      className="w-full"
                    >
                      {generatingPersonaId === persona.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

