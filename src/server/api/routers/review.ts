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

async function fetchReviewsFromBackend(params: {
  campaignId: string;
  ratingQuestionId?: string;
  reviewTextQuestionIds?: string;
  dateFilter?: string;
  limit?: number;
}) {
  const url = new URL(
    `${env.GO_BACKEND_URL}/api/v1/claimant/getWidgetReviews`,
  );
  url.searchParams.set("campaign_id", params.campaignId);
  if (params.ratingQuestionId)
    url.searchParams.set("rating_question_id", params.ratingQuestionId);
  if (params.reviewTextQuestionIds)
    url.searchParams.set(
      "review_text_question_ids",
      params.reviewTextQuestionIds,
    );
  if (params.dateFilter && params.dateFilter !== "ALL")
    url.searchParams.set("date_filter", params.dateFilter);
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`Go backend error: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as GoStandardResponse;
  if (!json.success || !json.data) return [];

  return json.data.map((r) => ({
    claimantId: r.claimant_id,
    rating: r.rating,
    text: r.text,
    reviewer: r.reviewer,
    verified: r.verified,
    createdAt: r.created_at,
  }));
}

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
    .query(async ({ input }) => {
      return fetchReviewsFromBackend({
        campaignId: input.campaignId,
        ratingQuestionId: input.ratingQuestionId,
        reviewTextQuestionIds: input.reviewTextQuestionIds,
        dateFilter: input.dateFilter,
        limit: input.limit,
      });
    }),
});
