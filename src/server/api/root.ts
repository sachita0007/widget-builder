import { widgetRouter } from "~/server/api/routers/widget";
import { reviewRouter } from "~/server/api/routers/review";
import { aiRouter } from "~/server/api/routers/ai";
import { campaignRouter } from "~/server/api/routers/campaign";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  widget: widgetRouter,
  review: reviewRouter,
  ai: aiRouter,
  campaign: campaignRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
