import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * TODO: Replace mock with Go backend call.
 *
 * Endpoint: GET /api/v1/campaign/:id/questions
 *
 * Returns the list of feedback questions configured for a campaign.
 * Each question has an id, text, and input type.
 */

// Mock questions per campaign — simulates Go backend response
const MOCK_QUESTIONS: Record<
  string,
  Array<{
    id: string;
    text: string;
    inputType: string;
  }>
> = {
  "a206d7bd-24a5-4e91-b16d-2619f8e0c292": [
    { id: "49c142f8-fd0b-47f8-b76d-467000325889", text: "rate your experience", inputType: "select_single" },
    { id: "af1ccda2-d6d3-4652-bac8-e78b0f13d3fe", text: "what went wrong?", inputType: "text_long" },
  ],
  "whiskas-july-2025": [
    { id: "q1-whiskas-rating", text: "How would you rate Whiskas?", inputType: "select_single" },
    { id: "q2-whiskas-review", text: "Tell us about your experience", inputType: "text_long" },
  ],
  "pedigree-aug-2025": [
    { id: "q1-pedigree-rating", text: "Rate Pedigree overall", inputType: "select_single" },
    { id: "q2-pedigree-review", text: "What did your dog think?", inputType: "text_long" },
  ],
  "dove-skincare-2025": [
    { id: "q1-dove-rating", text: "How would you rate Dove?", inputType: "select_single" },
    { id: "q2-dove-review", text: "Describe your skincare experience", inputType: "text_long" },
  ],
};

export const campaignRouter = createTRPCRouter({
  getQuestions: publicProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(({ input }) => {
      return MOCK_QUESTIONS[input.campaignId] ?? [];
    }),
});
