import { widgetRouter } from "~/server/api/routers/widget";
import { reviewRouter } from "~/server/api/routers/review";
import { aiRouter } from "~/server/api/routers/ai";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  widget: widgetRouter,
  review: reviewRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
