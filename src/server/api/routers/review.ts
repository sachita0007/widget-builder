import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  getByCampaign: publicProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.review.findMany({
        where: { campaignId: input.campaignId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
