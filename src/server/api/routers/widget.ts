import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

interface GoReviewEntry {
  claimant_id: string;
  rating: number;
  text: string;
  reviewer: string;
  verified: boolean;
  created_at: string;
}

interface GoStandardResponse {
  success: boolean;
  message?: string;
  data?: GoReviewEntry[];
}

export const widgetRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        campaignId: z.string(),
        template: z.string(),
        settings: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.widget.create({
        data: {
          name: input.name,
          campaignId: input.campaignId,
          template: input.template,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          settings: input.settings ?? {},
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
   * Returns widget config + reviews from Go backend.
   */
  getPublicById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const widget = await ctx.db.widget.findUnique({
        where: { id: input.id },
      });

      if (!widget) return null;

      const settings = widget.settings as {
        ratingQuestionId?: string;
        reviewTextQuestionIds?: string;
        dateFilter?: string;
        reviewLimit?: number;
      } | null;

      // Fetch reviews from Go backend
      let reviews: Array<{
        claimantId: string;
        rating: number;
        text: string;
        reviewer: string;
        verified: boolean;
        createdAt: string;
      }> = [];

      if (settings?.ratingQuestionId || settings?.reviewTextQuestionIds) {
        try {
          const url = new URL(
            `${env.GO_BACKEND_URL}/api/v1/claimant/getWidgetReviews`,
          );
          url.searchParams.set("campaign_id", widget.campaignId);
          if (settings.ratingQuestionId)
            url.searchParams.set(
              "rating_question_id",
              settings.ratingQuestionId,
            );
          if (settings.reviewTextQuestionIds)
            url.searchParams.set(
              "review_text_question_ids",
              settings.reviewTextQuestionIds,
            );
          if (settings.dateFilter && settings.dateFilter !== "ALL")
            url.searchParams.set("date_filter", settings.dateFilter);
          if (settings.reviewLimit)
            url.searchParams.set("limit", String(settings.reviewLimit));

          const res = await fetch(url.toString());
          if (res.ok) {
            const json = (await res.json()) as GoStandardResponse;
            if (json.success && json.data) {
              reviews = json.data.map((r) => ({
                claimantId: r.claimant_id,
                rating: r.rating,
                text: r.text,
                reviewer: r.reviewer,
                verified: r.verified,
                createdAt: r.created_at,
              }));
            }
          }
        } catch (err) {
          console.error("Failed to fetch reviews from Go backend:", err);
        }
      }

      return { ...widget, reviews };
    }),
});
