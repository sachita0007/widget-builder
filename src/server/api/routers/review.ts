
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
    generateAIReview: protectedProcedure
        .input(
            z.object({
                personaId: z.string(),
                campaignId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Fetch persona details to guide generation
            const persona = await ctx.db.persona.findUnique({
                where: { id: input.personaId },
            });

            if (!persona) {
                throw new Error("Persona not found");
            }

            // TODO: Connect to actual LLM (Gemini/OpenAI) here.
            // For now, we will return a deterministic "AI-like" response based on the persona.

            const mockReviewText = `[AI Generated] My ${persona.catAge} cat loved the ${persona.brand} ${persona.foodType}! Bought it from ${persona.boughtFrom} and it was great.`;

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            return ctx.db.review.create({
                data: {
                    rating: persona.rating,
                    text: mockReviewText,
                    reviewer: "Happy Customer (AI)",
                    verified: true, // Mark as verified for demo
                    campaignId: input.campaignId,
                    personaId: input.personaId,
                },
            });
        }),

    getByCampaign: protectedProcedure
        .input(z.object({ campaignId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.review.findMany({
                where: { campaignId: input.campaignId },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        })
});
