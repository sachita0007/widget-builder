
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// Initialize Gemini SDK instance
const getGeminiModel = (apiKey: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const aiRouter = createTRPCRouter({
    generateInsight: protectedProcedure
        .input(
            z.object({
                campaignId: z.string(),
                intent: z.enum(["TRIAL_VERDICT", "SWITCHER", "HABIT_BREAKER", "DEMOGRAPHIC"]),
                brandName: z.string(),
                insights: z.object({
                    totalResponses: z.number(),
                    avgRating: z.number(),
                    catAgeDistribution: z.record(z.number()),
                    brandLandscape: z.record(z.number()),
                    foodTypeBreakdown: z.record(z.number()),
                    trialRate: z.number(),
                }),
            }),
        )
        .mutation(async ({ input }) => {
            const { intent, brandName, insights } = input;

            if (!env.GEMINI_API_KEY) {
                return {
                    title: "AI Configuration Required",
                    badge: "SETUP",
                    text: "The Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.",
                    metric: "API KEY MISSING"
                };
            }

            const model = getGeminiModel(env.GEMINI_API_KEY);

            const intentMap = {
                TRIAL_VERDICT: {
                    goal: "Highlight the overwhelming success of the first-time trial and high conversion intent.",
                    metricFocus: "Trial Rate and Average Rating",
                    style: "Celebratory and Validation-heavy"
                },
                SWITCHER: {
                    goal: "Focus on users who left competitors and why they now prefer this brand.",
                    metricFocus: "Brand Landscape (Competitor migration)",
                    style: "Comparative and Authoritative"
                },
                HABIT_BREAKER: {
                    goal: "Address the shift from home-cooked or unbranded food to professional nutrition.",
                    metricFocus: "Food Type Breakdown (Home-cooked segment)",
                    style: "Educational and Transformative"
                },
                DEMOGRAPHIC: {
                    goal: "Target specific life stages like kittens or seniors based on dominant demographics.",
                    metricFocus: "Cat Age Distribution",
                    style: "Personalized and Lifestage-specific"
                }
            };

            const selectedIntent = intentMap[intent];

            const prompt = `
                You are a world-class marketing copywriter specializing in data-driven social proof for premium pet brands.
                Your task is to transform raw campaign metrics into a powerful "AI Insight Card" for a review widget.

                BRAND: ${brandName}
                INTENT: ${intent} (${selectedIntent.goal})
                STYLE REQUIREMENT: ${selectedIntent.style}

                DATA CONTEXT:
                - Verified Responses: ${insights.totalResponses}
                - Global Rating: ${insights.avgRating}/5
                - Trial Success Rate: ${insights.trialRate}%
                - Competitive Landscape: ${JSON.stringify(insights.brandLandscape)} (Numbers represent count of users switching FROM these brands)
                - Demographic (Cat Ages): ${JSON.stringify(insights.catAgeDistribution)}
                - Current Nutrition Source: ${JSON.stringify(insights.foodTypeBreakdown)} (Focus on 'Home Cooked' vs others)

                INSTRUCTIONS for ${intent}:
                1. Cite EXACT numbers from the DATA CONTEXT provided. Avoid making up generic percentages like "92%".
                2. For SWITCHER: Specifically mention the top competitor brands from the Brand Landscape data.
                3. For HABIT_BREAKER: Specifically calculate the percentage or count of users moving from 'Home Cooked' food.
                4. For DEMOGRAPHIC: Target the most dominant cat age group in the data.
                5. For TRIAL_VERDICT: Focus on the ${insights.trialRate}% trial rate as the primary trust signal.

                OUTPUT FORMAT (JSON ONLY):
                {
                    "title": "Impactful 3-5 word headline",
                    "badge": "2-word uppercase category (e.g., VERIFIED INSIGHT)",
                    "text": "One powerful, persuasive sentence using actual numbers from the data. Max 150 chars.",
                    "metric": "A concise KPI highlight (e.g., '77% Transition Rate')"
                }

                Return ONLY valid JSON.
            `;

            try {
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Extract JSON if model wraps it in markdown
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

                return JSON.parse(jsonStr) as {
                    title: string;
                    badge: string;
                    text: string;
                    metric: string;
                };
            } catch (error: any) {
                console.error("Gemini Generation Error:", error);

                const errorMessage = error instanceof Error ? error.message : String(error);

                // Fallback heuristic if Gemini fails
                return {
                    title: "Verified Social Proof",
                    badge: "DATA ANALYSIS",
                    text: `Based on ${insights.totalResponses.toLocaleString()} verified responses, users reported a high satisfaction rate.`,
                    metric: `AI Note: ${errorMessage.substring(0, 30)}...`
                };
            }
        }),
});
