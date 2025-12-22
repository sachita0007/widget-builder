import { useMemo, useState } from "react";
import { type Widget, type Review } from "@shared/schema";
import { Star, CheckCircle2, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PersonaModal } from "./PersonaModal";
import { useWidgetPersonas, useGenerateAiReview } from "@/hooks/use-widgets";

interface ReviewWidgetProps {
  widget: Widget;
  reviews: Review[];
  previewMode?: boolean;
}

export function ReviewWidget({ widget, reviews, previewMode = false }: ReviewWidgetProps) {
  const {
    templateType,
    primaryColor,
    secondaryColor,
    textColor,
    fontStyle,
    cornerRadius,
    cardSpacing,
    showBadge,
    badgePosition
  } = widget;

  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [googleCarouselIndex, setGoogleCarouselIndex] = useState(0);
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [personaCarouselIndices, setPersonaCarouselIndices] = useState<Record<string, number>>({});
  
  const { data: personas = [] } = useWidgetPersonas(templateType === "ai" ? widget.id : 0);
  const generateReview = useGenerateAiReview();
  
  // Filter AI-generated reviews
  const aiReviews = useMemo(() => {
    const filtered = reviews.filter(r => r.personaId);
    console.log('All reviews:', reviews.length);
    console.log('AI reviews (with personaId):', filtered.length);
    console.log('Sample AI review:', filtered[0]);
    return filtered;
  }, [reviews]);
  
  // Group reviews by persona for aggregate counts
  const reviewsByPersona = useMemo(() => {
    const grouped: Record<string, { reviews: Review[], persona: any }> = {};
    aiReviews.forEach(review => {
      if (review.personaId) {
        if (!grouped[review.personaId]) {
          const persona = personas.find(p => p.id === review.personaId);
          grouped[review.personaId] = { reviews: [], persona };
        }
        grouped[review.personaId].reviews.push(review);
      }
    });
    return grouped;
  }, [aiReviews, personas]);

  const fontClass = fontStyle === "serif" ? "font-serif" : "font-sans";
  const radiusClass = cornerRadius === "sharp" ? "rounded-none" : "rounded-lg";

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    return {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };
  }, [reviews]);

  // Carousel handlers
  const handleGooglePrev = () => {
    setGoogleCarouselIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1);
  };

  const handleGoogleNext = () => {
    setGoogleCarouselIndex(prev => prev === reviews.length - 1 ? 0 : prev + 1);
  };

  const handleImagePrev = () => {
    setImageCarouselIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1);
  };

  const handleImageNext = () => {
    setImageCarouselIndex(prev => prev === reviews.length - 1 ? 0 : prev + 1);
  };

  // Styles injected dynamically for custom colors
  const containerStyle = {
    "--primary": primaryColor,
    "--secondary": secondaryColor,
    "--text": textColor === "light" ? "#ffffff" : "#1a1a1a",
  } as React.CSSProperties;

  return (
    <div 
      className={cn("w-full h-full relative font-sans text-slate-900", fontClass)} 
      style={containerStyle}
    >
      {/* Template: AGGREGATED */}
      {templateType === "aggregated" && (
        <div className="max-w-4xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 p-6 bg-white shadow-sm rounded-xl border border-slate-100">
            {/* Verified Badge - Top Right */}
            {showBadge && (
              <div className="absolute top-3 right-3 z-10">
                <VerifiedBadgeIcon />
              </div>
            )}

            {/* Left side: Rating Summary */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-5xl font-bold text-[var(--primary)]">{averageRating}</div>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400 text-xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} fill="currentColor" className={cn("w-5 h-5", s > Math.round(Number(averageRating)) && "text-slate-200")} />
                    ))}
                  </div>
                  <div className="text-sm text-slate-500 font-medium mt-1">Average Rating</div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-4">{rating}★</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{
                          width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
                  </div>
                ))}
              </div>

              <div className="text-sm text-slate-500 font-medium mt-4">Based on {reviews.length} reviews</div>
            </div>
          </div>
        </div>
      )}

      {/* Template: GOOGLE STYLE */}
      {templateType === "google" && (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 p-6 bg-white rounded-xl border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-900 mb-2">What our customers say about us</div>
              </div>
              <div className="flex items-center gap-2 bg-white">
                <span className="text-4xl font-bold text-slate-900">{averageRating}</span>
                <Star fill="currentColor" className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="text-sm text-slate-500">Based on {reviews.length} reviews</div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={googleCarouselIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {reviews
                    .slice(googleCarouselIndex, googleCarouselIndex + 3)
                    .map((review) => (
                      <div
                        key={review.id}
                        className={cn("bg-white p-5 shadow-sm border border-slate-100 flex flex-col h-full relative", radiusClass)}
                      >
                        {/* Verified Badge - Top Right */}
                        {showBadge && (
                          <div className="absolute top-3 right-3 z-10">
                            <VerifiedBadgeIcon />
                          </div>
                        )}

                        {/* Header: Avatar, Name, Date */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={review.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${review.authorName}`} 
                              alt={review.authorName} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-sm text-slate-800">{review.authorName}</div>
                              <div className="text-xs text-slate-500">{review.date}</div>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex text-yellow-400 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} fill="currentColor" className={cn("w-4 h-4", star > review.rating ? "text-slate-200" : "")} />
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
                          {expandedReviewId === review.id ? review.content : review.content.substring(0, 120) + (review.content.length > 120 ? "..." : "")}
                        </p>

                        {/* Read More Link */}
                        {review.content.length > 120 && (
                          <button
                            onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                            className="text-blue-600 text-sm font-medium hover:underline text-left"
                          >
                            {expandedReviewId === review.id ? "Read less" : "Read more"}
                          </button>
                        )}
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 gap-4">
              <button
                onClick={handleGooglePrev}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                data-testid="button-google-carousel-prev"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGoogleCarouselIndex(i * 3)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      googleCarouselIndex === i * 3 ? "bg-slate-400 w-6" : "bg-slate-300"
                    )}
                    data-testid={`button-google-carousel-dot-${i}`}
                  />
                ))}
              </div>

              <button
                onClick={handleGoogleNext}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                data-testid="button-google-carousel-next"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template: AI GENERATED */}
      {templateType === "ai" && (
        <div className="max-w-6xl mx-auto">
          {/* Header with Generate Button */}
          <div className="mb-8 p-6 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-2">AI Generated Reviews</div>
              <div className="text-sm text-slate-500">
                {aiReviews.length > 0 
                  ? `${aiReviews.length} review${aiReviews.length > 1 ? 's' : ''} generated from ${Object.keys(reviewsByPersona).length} persona${Object.keys(reviewsByPersona).length > 1 ? 's' : ''}`
                  : "Generate reviews from personas captured during your campaign"
                }
              </div>
            </div>
            <Button
              onClick={() => setPersonaModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Reviews
            </Button>
          </div>

          {/* Generated Reviews - Horizontal Scrollable */}
          {aiReviews.length > 0 ? (
            <div className="relative">
              {/* Horizontal Scrollable Container */}
              <div 
                className="overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6" style={{ width: 'max-content' }}>
                  {Object.entries(reviewsByPersona).map(([personaId, { reviews: personaReviews, persona }]) => {
                    if (!persona) return null;
                    
                    const personaCarouselIndex = personaCarouselIndices[personaId] || 0;
                    const currentReview = personaReviews[personaCarouselIndex] || personaReviews[0];
                    const reviewCount = personaReviews.length;
                    
                    const handlePrev = () => {
                      setPersonaCarouselIndices(prev => ({
                        ...prev,
                        [personaId]: personaCarouselIndex === 0 ? reviewCount - 1 : personaCarouselIndex - 1
                      }));
                    };
                    
                    const handleNext = () => {
                      setPersonaCarouselIndices(prev => ({
                        ...prev,
                        [personaId]: personaCarouselIndex === reviewCount - 1 ? 0 : personaCarouselIndex + 1
                      }));
                    };
                    
                    const setPersonaCarouselIndex = (index: number) => {
                      setPersonaCarouselIndices(prev => ({
                        ...prev,
                        [personaId]: index
                      }));
                    };
                    
                    return (
                      <div 
                        key={personaId} 
                        className={cn("bg-white rounded-xl border-2 border-slate-200 shadow-lg relative flex-shrink-0", radiusClass)}
                        style={{ width: '420px' }}
                      >
                        {showBadge && badgePosition === "top-right" && (
                          <div className="absolute top-4 right-4 z-10">
                            <VerifiedBadgeIcon />
                          </div>
                        )}
                        
                        {/* Persona Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-base text-slate-700">{persona.id}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  fill={star <= persona.rating ? "currentColor" : "none"}
                                  className={cn("w-4 h-4", star <= persona.rating ? "text-yellow-400" : "text-slate-300")}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            Previously: <span className="font-semibold">{persona.brand}</span> • {persona.foodType} • {persona.catAge}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Intl.NumberFormat("en-US").format(persona.count)} survey responses
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="p-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={personaCarouselIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              {/* Author Info */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={currentReview.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentReview.authorName}`} 
                                    alt={currentReview.authorName} 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                                  />
                                  <div>
                                    <div className="font-bold text-base text-slate-800">{currentReview.authorName}</div>
                                    <div className="text-xs text-slate-500">{currentReview.date}</div>
                                  </div>
                                </div>
                                <div className="flex text-yellow-400">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} fill="currentColor" className={cn("w-5 h-5", star > currentReview.rating ? "text-slate-200" : "")} />
                                  ))}
                                </div>
                              </div>

                              {/* Review Text */}
                              <p className="text-sm text-slate-700 leading-relaxed mb-4 min-h-[100px]">
                                {currentReview.content}
                              </p>
                              
                              {/* Navigation & Actions */}
                              <div className="pt-4 border-t border-slate-200 space-y-3">
                                {reviewCount > 1 && (
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={handlePrev}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                      aria-label="Previous review"
                                    >
                                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                      {personaReviews.map((_, i) => (
                                        <button
                                          key={i}
                                          onClick={() => setPersonaCarouselIndex(i)}
                                          className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all",
                                            personaCarouselIndex === i ? "bg-slate-600 w-6" : "bg-slate-300"
                                          )}
                                          aria-label={`Go to review ${i + 1}`}
                                        />
                                      ))}
                                    </div>
                                    <button
                                      onClick={handleNext}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                      aria-label="Next review"
                                    >
                                      <ChevronRight className="w-4 h-4 text-slate-600" />
                                    </button>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    generateReview.mutate(
                                      { widgetId: widget.id, personaId },
                                      {
                                        onSuccess: () => {
                                          // Review will be refetched automatically
                                        }
                                      }
                                    );
                                  }}
                                  disabled={generateReview.isPending}
                                  className="w-full"
                                >
                                  {generateReview.isPending ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3 mr-2" />
                                      Generate Another
                                    </>
                                  )}
                                </Button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Scroll hint gradient */}
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <div className="text-lg font-semibold text-slate-700 mb-2">No AI reviews generated yet</div>
              <div className="text-sm text-slate-500 mb-6">
                Click "Generate Reviews" to create reviews from your campaign personas
              </div>
              <Button
                onClick={() => setPersonaModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Your First Review
              </Button>
            </div>
          )}

          {/* Persona Modal */}
          <PersonaModal
            open={personaModalOpen}
            onOpenChange={setPersonaModalOpen}
            widgetId={widget.id}
            onReviewGenerated={() => {
              // Reviews will be refetched automatically via React Query
            }}
          />
        </div>
      )}

      {/* Template: IMAGE BASED */}
      {templateType === "image" && (
        <div className="max-w-6xl mx-auto">
          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imageCarouselIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {reviews
                    .slice(imageCarouselIndex, imageCarouselIndex + 3)
                    .map((review) => (
                      <div
                        key={review.id}
                        className="flex flex-col bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm relative"
                      >
                        {/* Verified Badge - Top Right */}
                        {showBadge && (
                          <div className="absolute top-3 right-3 z-10">
                            <VerifiedBadgeIcon />
                          </div>
                        )}

                        {/* Image Container */}
                        <div className="relative aspect-square bg-slate-100 overflow-hidden">
                          <img 
                            src={review.imageUrl || `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80`} 
                            alt="Review" 
                            className="w-full h-full object-cover"
                          />
                          {/* Rating Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <div className="flex text-yellow-400 gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} fill="currentColor" className={cn("w-3 h-3", star > review.rating ? "text-slate-200" : "")} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Review Info */}
                        <div className="p-4 flex flex-col flex-grow">
                          {/* User Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={review.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${review.authorName}`} 
                              alt={review.authorName} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-sm text-slate-800">{review.authorName}</div>
                              <div className="text-xs text-slate-500">{review.date}</div>
                            </div>
                          </div>

                          {/* Review Text */}
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {expandedReviewId === review.id ? review.content : review.content.substring(0, 100) + (review.content.length > 100 ? "..." : "")}
                          </p>

                          {/* Expand/Collapse Button */}
                          {review.content.length > 100 && (
                            <button
                              onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                              className="text-blue-600 text-xs font-medium hover:underline text-left mt-2"
                            >
                              {expandedReviewId === review.id ? "Read less" : "Read more"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 gap-4">
              <button
                onClick={handleImagePrev}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                data-testid="button-image-carousel-prev"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageCarouselIndex(i * 3)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      imageCarouselIndex === i * 3 ? "bg-slate-400 w-6" : "bg-slate-300"
                    )}
                    data-testid={`button-image-carousel-dot-${i}`}
                  />
                ))}
              </div>

              <button
                onClick={handleImageNext}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                data-testid="button-image-carousel-next"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BADGE (if top-right) */}
      {showBadge && badgePosition === "top-right" && (
        <div className="absolute top-4 right-4 z-10">
          <VerifiedBadge compact />
        </div>
      )}
    </div>
  );
}

function VerifiedBadge({ compact }: { compact: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm text-xs font-semibold text-blue-900 select-none cursor-help hover:border-blue-200 transition-colors">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            {!compact && <span>Verified by Freestand</span>}
            {compact && <span>Verified</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-900 text-white border-slate-700">
          These reviews are verified through Freestand product sampling
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function VerifiedBadgeIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-help">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
          Verified by Freestand
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
