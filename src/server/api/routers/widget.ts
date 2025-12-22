
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const widgetRouter = createTRPCRouter({
    create: protectedProcedure
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
                    settings: {}, // usage defaults handled in frontend or extended schema
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                template: z.string().optional(),
                settings: z.any().optional(), // Using detailed validation in real app recommended
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.db.widget.update({
                where: { id },
                data,
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.widget.delete({
                where: { id: input.id },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const widget = await ctx.db.widget.findUnique({
                where: { id: input.id },
                include: {
                    campaign: {
                        include: {
                            personas: true,
                        }
                    }
                }
            });

            if (!widget || !widget.campaign) return widget;

            const campaign = widget.campaign;

            // Calculate Aggregate Insights from Personas
            const totalResponses = campaign.personas.reduce((acc, p) => acc + p.count, 0);
            const totalRatingPoints = campaign.personas.reduce((acc, p) => acc + (p.rating * p.count), 0);
            const avgRating = totalResponses > 0 ? Number((totalRatingPoints / totalResponses).toFixed(1)) : 0;

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
                ...widget,
                campaign: {
                    ...campaign,
                    insights: {
                        totalResponses,
                        avgRating,
                        catAgeDistribution,
                        brandLandscape,
                        foodTypeBreakdown,
                        purchaseIntent: 63,
                        trialRate: 77,
                    }
                }
            };
        }),

    getPublicById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.widget.findUnique({
                where: { id: input.id },
                include: {
                    campaign: {
                        include: {
                            reviews: true
                        }
                    }
                }
            })
        })
});
