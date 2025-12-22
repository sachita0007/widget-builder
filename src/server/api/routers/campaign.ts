
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
            const campaign = await ctx.db.campaign.findUnique({
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

            if (!campaign) return null;

            // Calculate Aggregate Insights from Personas
            const totalResponses = campaign.personas.reduce((acc, p) => acc + p.count, 0);
            const totalRatingPoints = campaign.personas.reduce((acc, p) => acc + (p.rating * p.count), 0);
            const avgRating = totalResponses > 0 ? Number((totalRatingPoints / totalResponses).toFixed(1)) : 0;

            // Grouping for charts
            const catAgeDistribution = campaign.personas.reduce((acc: Record<string, number>, p) => {
                acc[p.catAge] = (acc[p.catAge] ?? 0) + p.count;
                return acc;
            }, {});

            const brandLandscape = campaign.personas.reduce((acc: Record<string, number>, p) => {
                if (p.brand !== "None") {
                    acc[p.brand] = (acc[p.brand] ?? 0) + p.count;
                }
                return acc;
            }, {});

            const foodTypeBreakdown = campaign.personas.reduce((acc: Record<string, number>, p) => {
                acc[p.foodType] = (acc[p.foodType] ?? 0) + p.count;
                return acc;
            }, {});

            return {
                ...campaign,
                insights: {
                    totalResponses,
                    avgRating,
                    catAgeDistribution,
                    brandLandscape,
                    foodTypeBreakdown,
                    // Derived metrics
                    purchaseIntent: 63, // Hardcoded for now as it's a specific goal status
                    trialRate: 77,     // Hardcoded for now
                }
            };
        }),
});
