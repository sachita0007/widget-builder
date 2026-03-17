import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * TODO: Replace mock with actual Go backend call.
 *
 * ==========================================
 * GO BACKEND ROUTE SPEC
 * ==========================================
 *
 * Endpoint: GET /api/v1/widget/reviews
 *
 * Query params:
 *   - campaign_id          (string, required) — the campaign UUID
 *   - rating_question_id   (string, required) — question UUID for the rating
 *                            (type: select_single or text_number)
 *   - review_text_question_id (string, required) — question UUID for the review text
 *                            (type: text_long or text_short)
 *
 * Data flow:
 *   claimant_question_response table
 *   ├── claimant_id → JOIN claimant → JOIN user → user.name = reviewer
 *   ├── question_id (rating_question_id) → COALESCE(response.text, cqr.response_text) = rating
 *   ├── question_id (review_text_question_id) → cqr.response_text = review text
 *   └── created_at = review date
 *
 * Response shape (StandardResponse):
 *   {
 *     "success": true,
 *     "data": [
 *       {
 *         "rating": 5,
 *         "text": "Great product, my cat loves it!",
 *         "reviewer": "Arnav Sharma",
 *         "verified": true,
 *         "created_at": "2025-07-10T10:00:00Z"
 *       }
 *     ]
 *   }
 *
 * ==========================================
 * FILES TO CREATE IN GO BACKEND
 * ==========================================
 *
 * 1. SQLc query — db/query/claimant/widget_reviews.sql
 *
 *    -- name: GetReviewsForWidget :many
 *    SELECT
 *      u.name as reviewer,
 *      COALESCE(r_rating.text, cqr_rating.response_text) as rating,
 *      COALESCE(r_review.text, cqr_review.response_text) as review_text,
 *      cqr_review.created_at
 *    FROM claimant c
 *    JOIN "user" u ON c.user_id = u.id
 *    LEFT JOIN claimant_question_response cqr_rating
 *      ON c.id = cqr_rating.claimant_id AND cqr_rating.question_id = @rating_question_id
 *    LEFT JOIN response r_rating ON cqr_rating.response_id = r_rating.id
 *    LEFT JOIN claimant_question_response cqr_review
 *      ON c.id = cqr_review.claimant_id AND cqr_review.question_id = @review_text_question_id
 *    LEFT JOIN response r_review ON cqr_review.response_id = r_review.id
 *    WHERE c.campaign_id = @campaign_id
 *      AND cqr_review.response_text IS NOT NULL
 *    ORDER BY cqr_review.created_at DESC;
 *
 *    Then run: make sqlc-generate-claimant
 *
 * 2. Handler — src/api/handlers/widget.go
 *
 *    type Widget struct {
 *        db     *database.Database
 *        DBRepo *repository.Repository
 *    }
 *
 *    type ReviewResponse struct {
 *        Rating    int    `json:"rating"`
 *        Text      string `json:"text"`
 *        Reviewer  string `json:"reviewer"`
 *        Verified  bool   `json:"verified"`
 *        CreatedAt string `json:"created_at"`
 *    }
 *
 *    func (w *Widget) GetReviews(c echo.Context) error {
 *        campaignID := c.QueryParam("campaign_id")
 *        ratingQuestionID := c.QueryParam("rating_question_id")
 *        reviewTextQuestionID := c.QueryParam("review_text_question_id")
 *
 *        rows, err := w.db.ClaimantQueries().GetReviewsForWidget(ctx, ...)
 *        if err != nil { return c.JSON(500, NewErrorResponse(err.Error())) }
 *
 *        reviews := []ReviewResponse{}
 *        for _, row := range rows {
 *            rating, _ := strconv.Atoi(row.Rating)
 *            reviews = append(reviews, ReviewResponse{
 *                Rating:    rating,
 *                Text:      row.ReviewText,
 *                Reviewer:  row.Reviewer,
 *                Verified:  true,
 *                CreatedAt: row.CreatedAt.Time.Format(time.RFC3339),
 *            })
 *        }
 *        return c.JSON(200, NewSuccessResponse(reviews))
 *    }
 *
 * 3. Route registration — src/api/routes/routes.go
 *
 *    func SetupWidgetRoutes(g *echo.Group, h *handlers.Widget) {
 *        g.GET("/reviews", h.GetReviews)
 *    }
 *
 *    In api.go:
 *    routes.SetupWidgetRoutes(apiV1.Group("/widget"), h.Widget)
 *
 * ==========================================
 * WIDGET BUILDER INTEGRATION
 * ==========================================
 *
 * Once the Go route is live, replace the mock below with:
 *
 *   const GO_BACKEND_URL = env.GO_BACKEND_URL; // add to env.js
 *   const res = await fetch(
 *     `${GO_BACKEND_URL}/api/v1/widget/reviews` +
 *     `?campaign_id=${input.campaignId}` +
 *     `&rating_question_id=${input.ratingQuestionId}` +
 *     `&review_text_question_id=${input.reviewTextQuestionId}`
 *   );
 *   const json = await res.json();
 *   return json.data;
 *
 * Also store ratingQuestionId and reviewTextQuestionId in
 * widget.settings JSON so getPublicById can use them.
 */

// Mock review data — simulates Go backend StandardResponse.data
const MOCK_REVIEWS: Record<
  string,
  Array<{
    rating: number;
    text: string;
    reviewer: string;
    verified: boolean;
    createdAt: string;
  }>
> = {
  "whiskas-july-2025": [
    { rating: 5, reviewer: "Arnav Sharma", text: "We used to feed home cooked food but Whiskas is much easier and my 2-year-old Persian cat loved it! Her coat is much shinier now.", verified: true, createdAt: "2025-07-10T10:00:00Z" },
    { rating: 5, reviewer: "Ananya Gupta", text: "My 10-month-old kitten meows for Whiskas every morning. It's so much more convenient than preparing fresh chicken every day.", verified: true, createdAt: "2025-07-09T10:00:00Z" },
    { rating: 4, reviewer: "Vikram Malhotra", text: "Switched from local butcher meat to Whiskas for my adult cat. He's much more active and his digestion has improved significantly.", verified: true, createdAt: "2025-07-08T10:00:00Z" },
    { rating: 5, reviewer: "Priya Das", text: "Best value for money. My cat was a fussy eater with home food, but she finished her bowl of Whiskas in seconds!", verified: true, createdAt: "2025-07-07T10:00:00Z" },
    { rating: 5, reviewer: "Ishaan Verma", text: "Great quality ingredients. You can tell they care about feline nutrition. My 3-year-old Indie cat is thriving.", verified: true, createdAt: "2025-07-06T10:00:00Z" },
    { rating: 4, reviewer: "Rahul Mehra", text: "Good quality, but wish the packaging was resealable. My cat loves the taste though.", verified: true, createdAt: "2025-07-05T10:00:00Z" },
    { rating: 5, reviewer: "Sanya Iyer", text: "Whiskas has been a game changer for my senior cat. The wet pouches are perfect.", verified: true, createdAt: "2025-07-04T10:00:00Z" },
    { rating: 5, reviewer: "Aavya Reddy", text: "I was skeptical about packaged food, but my vet recommended Whiskas. My kitten is growing so fast!", verified: true, createdAt: "2025-07-03T10:00:00Z" },
    { rating: 4, reviewer: "Karan Singh", text: "Convenient and my cat loves it. Definitely easier than boiling chicken every day.", verified: true, createdAt: "2025-07-02T10:00:00Z" },
    { rating: 5, reviewer: "Meera Nair", text: "The variety of flavors keeps my cat interested. He never got this excited for home cooked meals.", verified: true, createdAt: "2025-07-01T10:00:00Z" },
  ],
  "pedigree-aug-2025": [
    { rating: 5, reviewer: "Abhishek Kumar", text: "My 5-year-old Labrador has been on Pedigree since he was a puppy. His coat is shiny and he's full of energy!", verified: true, createdAt: "2025-08-10T10:00:00Z" },
    { rating: 4, reviewer: "Sneha Patel", text: "Switched to Pedigree for my 2-year-old German Shepherd. He finished the bowl in seconds!", verified: true, createdAt: "2025-08-09T10:00:00Z" },
    { rating: 5, reviewer: "Rohan Mehta", text: "The only brand I trust for my 7-year-old Golden Retriever. His joint health is excellent.", verified: true, createdAt: "2025-08-08T10:00:00Z" },
    { rating: 5, reviewer: "Divya Krishnan", text: "My 3-year-old Indie dog loves Pedigree. His teeth are healthy and his energy levels are perfect.", verified: true, createdAt: "2025-08-07T10:00:00Z" },
    { rating: 4, reviewer: "Aarav Desai", text: "Good value for money. My 1-year-old Beagle is growing well and his coat is beautiful.", verified: true, createdAt: "2025-08-06T10:00:00Z" },
  ],
  "dove-skincare-2025": [
    { rating: 5, reviewer: "Nisha Agarwal", text: "I've been using Dove for 3 years. My skin feels softer and more hydrated.", verified: true, createdAt: "2025-06-10T10:00:00Z" },
    { rating: 5, reviewer: "Pooja Sharma", text: "Doesn't irritate my sensitive skin at all. Perfect for daily use.", verified: true, createdAt: "2025-06-09T10:00:00Z" },
    { rating: 4, reviewer: "Kavya Menon", text: "Great moisturizing soap. My skin used to be very dry but after Dove, it's much better.", verified: true, createdAt: "2025-06-08T10:00:00Z" },
    { rating: 5, reviewer: "Ritika Bansal", text: "Gentle on skin. My dermatologist recommended it.", verified: true, createdAt: "2025-06-07T10:00:00Z" },
  ],
};

export const reviewRouter = createTRPCRouter({
  /**
   * Fetch reviews for a campaign.
   * Accepts question IDs to map CQR data to review fields.
   *
   * TODO: Replace mock with Go backend call (see spec above).
   */
  getByCampaign: publicProcedure
    .input(
      z.object({
        campaignId: z.string(),
        ratingQuestionId: z.string().optional(),
        reviewTextQuestionId: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      // TODO: Call Go backend GET /api/v1/widget/reviews
      // with campaign_id, rating_question_id, review_text_question_id
      // For now return mock data keyed by campaignId
      return MOCK_REVIEWS[input.campaignId] ?? [];
    }),
});
