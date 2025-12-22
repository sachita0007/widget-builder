
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
            return ctx.db.widget.findUnique({
                where: { id: input.id },
                include: { campaign: true }
            })
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
