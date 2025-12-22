
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const campaignRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.campaign.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { reviews: true, personas: true },
                },
            },
            where: { createdById: ctx.session.user.id },
        });
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.campaign.findUnique({
                where: { id: input.id },
                include: {
                    personas: true,
                    widgets: true,
                    reviews: {
                        take: 5,
                        orderBy: { createdAt: "desc" },
                    },
                    _count: {
                        select: { reviews: true, personas: true }
                    }
                },
            });
        }),
});
