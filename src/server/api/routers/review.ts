import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Go backend call disabled temporarily — using dummy data on frontend
export const reviewRouter = createTRPCRouter({
  getByCampaign: publicProcedure
    .input(
      z.object({
        campaignId: z.string(),
        ratingQuestionId: z.string().optional(),
        reviewTextQuestionIds: z.string().optional(),
        dateFilter: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async () => {
      return [];
    }),
});
