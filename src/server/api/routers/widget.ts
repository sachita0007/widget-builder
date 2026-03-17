import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * TODO: Replace mock reviews in getPublicById with Go backend call.
 * See review.ts for the Go backend route spec.
 */

// Same mock data used for public widget rendering
const MOCK_REVIEWS: Record<
  string,
  Array<{
    rating: number;
    text: string;
    reviewer: string;
    verified: boolean;
    createdAt: string;
  }>
> = {
  "whiskas-july-2025": [
    { rating: 5, reviewer: "Arnav Sharma", text: "We used to feed home cooked food but Whiskas is much easier and my 2-year-old Persian cat loved it!", verified: true, createdAt: "2025-07-10T10:00:00Z" },
    { rating: 5, reviewer: "Ananya Gupta", text: "My 10-month-old kitten meows for Whiskas every morning. So much more convenient.", verified: true, createdAt: "2025-07-09T10:00:00Z" },
    { rating: 4, reviewer: "Vikram Malhotra", text: "Switched from local butcher meat to Whiskas. He's much more active now.", verified: true, createdAt: "2025-07-08T10:00:00Z" },
    { rating: 5, reviewer: "Priya Das", text: "Best value for money. My cat finished her bowl in seconds!", verified: true, createdAt: "2025-07-07T10:00:00Z" },
    { rating: 5, reviewer: "Ishaan Verma", text: "Great quality ingredients. My 3-year-old Indie cat is thriving.", verified: true, createdAt: "2025-07-06T10:00:00Z" },
    { rating: 4, reviewer: "Rahul Mehra", text: "Good quality. My cat loves the taste though.", verified: true, createdAt: "2025-07-05T10:00:00Z" },
    { rating: 5, reviewer: "Sanya Iyer", text: "Game changer for my senior cat. The wet pouches are perfect.", verified: true, createdAt: "2025-07-04T10:00:00Z" },
    { rating: 5, reviewer: "Aavya Reddy", text: "My vet recommended Whiskas. My kitten is growing so fast!", verified: true, createdAt: "2025-07-03T10:00:00Z" },
    { rating: 4, reviewer: "Karan Singh", text: "Convenient and my cat loves it.", verified: true, createdAt: "2025-07-02T10:00:00Z" },
    { rating: 5, reviewer: "Meera Nair", text: "The variety of flavors keeps my cat interested.", verified: true, createdAt: "2025-07-01T10:00:00Z" },
  ],
  "pedigree-aug-2025": [
    { rating: 5, reviewer: "Abhishek Kumar", text: "My Labrador has been on Pedigree since he was a puppy. Full of energy!", verified: true, createdAt: "2025-08-10T10:00:00Z" },
    { rating: 4, reviewer: "Sneha Patel", text: "Switched to Pedigree for my German Shepherd. He finished the bowl in seconds!", verified: true, createdAt: "2025-08-09T10:00:00Z" },
    { rating: 5, reviewer: "Rohan Mehta", text: "The only brand I trust for my Golden Retriever.", verified: true, createdAt: "2025-08-08T10:00:00Z" },
    { rating: 5, reviewer: "Divya Krishnan", text: "My Indie dog loves Pedigree. Healthy and energetic.", verified: true, createdAt: "2025-08-07T10:00:00Z" },
    { rating: 4, reviewer: "Aarav Desai", text: "Good value for money. My Beagle is growing well.", verified: true, createdAt: "2025-08-06T10:00:00Z" },
  ],
  "dove-skincare-2025": [
    { rating: 5, reviewer: "Nisha Agarwal", text: "My skin feels softer and more hydrated.", verified: true, createdAt: "2025-06-10T10:00:00Z" },
    { rating: 5, reviewer: "Pooja Sharma", text: "Doesn't irritate my sensitive skin. Perfect for daily use.", verified: true, createdAt: "2025-06-09T10:00:00Z" },
    { rating: 4, reviewer: "Kavya Menon", text: "Great moisturizing soap. My skin is much better.", verified: true, createdAt: "2025-06-08T10:00:00Z" },
    { rating: 5, reviewer: "Ritika Bansal", text: "Gentle on skin. My dermatologist recommended it.", verified: true, createdAt: "2025-06-07T10:00:00Z" },
  ],
};

export const widgetRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        campaignId: z.string(),
        template: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.widget.create({
        data: {
          name: input.name,
          campaignId: input.campaignId,
          template: input.template,
          settings: {},
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        template: z.string().optional(),
        settings: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.widget.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.widget.delete({
        where: { id: input.id },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.widget.findUnique({
        where: { id: input.id },
      });
    }),

  getByCampaign: publicProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.widget.findMany({
        where: { campaignId: input.campaignId },
        orderBy: { updatedAt: "desc" },
      });
    }),

  /**
   * Public endpoint for embedded widgets.
   * Returns widget config + reviews from Go backend (mocked for now).
   *
   * TODO: Replace MOCK_REVIEWS with Go backend call.
   * Full spec in review.ts. Summary:
   *
   *   const settings = widget.settings as {
   *     ratingQuestionId?: string;
   *     reviewTextQuestionId?: string;
   *     ...
   *   };
   *   const res = await fetch(
   *     `${GO_BACKEND_URL}/api/v1/widget/reviews` +
   *     `?campaign_id=${widget.campaignId}` +
   *     `&rating_question_id=${settings.ratingQuestionId}` +
   *     `&review_text_question_id=${settings.reviewTextQuestionId}`
   *   );
   *   const { data: reviews } = await res.json();
   *
   * The Go route JOINs claimant_question_response → claimant → user
   * to get reviewer name (user.name), rating (from rating question),
   * and review text (from review text question) per claimant.
   */
  getPublicById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const widget = await ctx.db.widget.findUnique({
        where: { id: input.id },
      });

      if (!widget) return null;

      // TODO: Use widget.settings.ratingQuestionId & reviewTextQuestionId
      // to call Go backend GET /api/v1/widget/reviews
      const reviews = MOCK_REVIEWS[widget.campaignId] ?? [];

      return { ...widget, reviews };
    }),
});
