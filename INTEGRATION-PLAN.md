# Integration Plan: Review Widget → Sampling-Central

## Overview

Extract widget templates, editor, and embed system from this standalone app into the freestand monorepo's sampling-central app. Reviews will come from a `getReviews(campaignId)` stub (Go backend routes built later).

## What gets integrated

- 4 widget templates (Aggregated, Google, Image, AI-Gen)
- Widget editor (simplified, no tRPC coupling)
- Embed script + public widget page for iframe embedding
- Widget config storage (new Prisma model)

## What stays out

- Campaign/persona management
- Dashboard/sidebar/navigation
- This app's auth system

---

## Steps

### 1. Add shared types to `@freestand/types`

**New file:** `packages/types/src/review-widget.ts`

- `Review` interface: `{ rating, text, reviewer, verified? }`
- `WidgetConfig` interface: all settings (colors, fonts, layout, badge config)
- `TemplateName` type: `"AGGREGATED" | "GOOGLE" | "IMAGE" | "AI_GEN"`
- `DEFAULT_WIDGET_CONFIG` constant

### 2. Port widget templates to `@freestand/ui`

**New directory:** `packages/ui/components/review-widget/`

Split `widget-templates.tsx` (795 lines) into individual files:

| File | Component |
|------|-----------|
| `aggregated-template.tsx` | AggregatedTemplate |
| `advanced-review-template.tsx` | AdvancedReviewTemplate (Google) |
| `image-template.tsx` | ImageTemplate |
| `ai-gen-template.tsx` | AIGenTemplate |
| `review-card.tsx` | ReviewCard |
| `verified-shield.tsx` | VerifiedShield |
| `image-with-fallback.tsx` | ImageWithFallback |
| `widget-renderer.tsx` | Switch component accepting props |
| `utils.ts` | Helper functions |
| `icons.tsx` | SVG constants |
| `index.ts` | Barrel exports |

**Compatibility:** No changes needed — TW classes work in TW 3.4, React hooks work in React 18, `"use client"` is harmless in Pages Router.

### 3. Add `ReviewWidget` Prisma model

**Modify:** `packages/prisma/schema.prisma`

```prisma
model ReviewWidget {
  id         String   @id @default(uuid())
  campaignId String   @unique
  template   String   @default("GOOGLE")
  settings   Json     @default("{}")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  campaign   Campaign @relation(fields: [campaignId], references: [id])
}
```

Add `reviewWidget ReviewWidget?` to the `Campaign` model.

### 4. Create mock reviews + stub function

**New files in `apps/sampling-central/`:**

- `src/utils/client/mock-reviews.ts` — 10 mock reviews
- `src/server/api/handlers/getReviews.ts` — stub returning mock data, TODO for Go backend call

### 5. Create tRPC router

**New file:** `apps/sampling-central/src/server/api/routers/review-widget.ts`

- `getConfig(campaignId)` — protected, returns widget config
- `saveConfig(campaignId, template, settings)` — protected, upserts
- `getReviews(campaignId)` — protected, calls stub
- `getPublicWidget(campaignId)` — **public**, for embed iframe

**Modify:** `apps/sampling-central/src/server/api/root.ts` — register router

### 6. Build widget editor component

**New directory:** `apps/sampling-central/src/components/reviewWidget/`

| File | Purpose |
|------|---------|
| `index.tsx` | ReviewWidgetTab — editor + live preview |
| `ReviewWidgetEditor.tsx` | Settings panel (tRPC replaced with callbacks) |
| `EmbedCodeModal.tsx` | Ant Design Modal with embed script + copy |

### 7. Add "Review Widget" tab to campaign page

**Modify:** `apps/sampling-central/src/pages/client/campaigns/[Id]/index.tsx`

Add tab to existing Ant Design Tabs:
```typescript
{ key: 'reviewWidget', label: 'Review Widget', children: <ReviewWidgetTab campaignId={campaignId} /> }
```

### 8. Create embed system

- `src/pages/api/widget/[campaignId]/embed.ts` — JS embed script (CORS, 1hr cache)
- `src/pages/widget/[campaignId].tsx` — Public page for iframe, ResizeObserver + postMessage

Ensure middleware does not redirect `/widget/[campaignId]` to login.

---

## Data Flow

```
sampling-central campaign page
  → "Review Widget" tab
    → ReviewWidgetEditor (settings)
    → WidgetRenderer (live preview with mock reviews)
    → EmbedCodeModal (shareable script tag)

External site
  → <script> tag loads embed.ts
    → Creates iframe → /widget/[campaignId]
      → getPublicWidget (public tRPC) → renders WidgetRenderer
      → ResizeObserver → postMessage → auto-height
```

## Target Repos

- **Widget Builder (source):** `/home/sachita/Desktop/dev/freestand/review-widget/widget-bulder`
- **Freestand Frontend (target):** `/home/sachita/Desktop/freestand/freestand`
- **Go Backend (later):** `/home/sachita/Desktop/freestand/go-backend`
