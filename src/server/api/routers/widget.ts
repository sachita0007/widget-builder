import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      return { ...widget, reviews: [] };
    }),
});
