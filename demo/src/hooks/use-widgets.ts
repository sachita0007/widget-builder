import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertWidget, type InsertReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ============================================
// WIDGETS
// ============================================

export const MOCK_WIDGETS = [
  {
    id: 101,
    name: "Whiskas July 2025",
    templateType: "aggregated" as const,
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date(),
    status: "active",
    userId: "mock-user",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    rating: 4.5,
    reviewCount: 120,
    logoUrl: null,
    businessName: "Whiskas",
    welcomeTitle: "Tell us about your experience",
    welcomeMessage: "We'd love to hear your thoughts!",
    enablePersonas: true,
    badgePosition: "bottom-right",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    successMessage: "Thank you for your feedback!",
    fontStyle: "inter",
    cornerRadius: 12,
    cardSpacing: 16,
    showBadge: true
  },
  {
    id: 102,
    name: "Pedigree July 2025",
    templateType: "google" as const,
    createdAt: new Date("2025-07-15"),
    updatedAt: new Date(),
    status: "active",
    userId: "mock-user",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    rating: 4.2,
    reviewCount: 85,
    logoUrl: null,
    businessName: "Pedigree",
    welcomeTitle: "Tell us about your experience",
    welcomeMessage: "We'd love to hear your thoughts!",
    enablePersonas: true,
    badgePosition: "bottom-right",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    successMessage: "Thank you for your feedback!",
    fontStyle: "inter",
    cornerRadius: 12,
    cardSpacing: 16,
    showBadge: true
  }
];

export function useWidgets() {
  return useQuery({
    queryKey: [api.widgets.list.path],
    queryFn: async () => {
      // Return mocks for demo purposes
      return MOCK_WIDGETS;
      /*
      const res = await fetch(api.widgets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch widgets");
      return api.widgets.list.responses[200].parse(await res.json());
      */
    },
  });
}

export function useWidget(id: number) {
  return useQuery({
    queryKey: [api.widgets.get.path, id],
    queryFn: async () => {
      // Check mocks first
      const mock = MOCK_WIDGETS.find(w => w.id === id);
      if (mock) return mock;

      const url = buildUrl(api.widgets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch widget");
      return api.widgets.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateWidget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWidget) => {
      const res = await fetch(api.widgets.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create widget");
      }
      return api.widgets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.widgets.list.path] });
      toast({
        title: "Success",
        description: "Widget created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertWidget>) => {
      const url = buildUrl(api.widgets.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update widget");
      }
      return api.widgets.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.widgets.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.widgets.get.path, data.id] });
      toast({
        title: "Changes Saved",
        description: "Your widget has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useDeleteWidget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.widgets.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete widget");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.widgets.list.path] });
      toast({
        title: "Deleted",
        description: "Widget removed successfully",
      });
    },
  });
}

// ============================================
// REVIEWS
// ============================================

export function useWidgetReviews(widgetId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, widgetId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { widgetId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !isNaN(widgetId),
  });
}

export function useSeedReviews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (widgetId: number) => {
      const url = buildUrl(api.reviews.seed.path, { widgetId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to seed reviews");
      return api.reviews.seed.responses[201].parse(await res.json());
    },
    onSuccess: (_, widgetId) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, widgetId] });
      toast({
        title: "Demo Data Loaded",
        description: "Added 5 sample reviews to your widget.",
      });
    },
  });
}

export function useGenerateAiReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ widgetId, personaId }: { widgetId: number; personaId: string }) => {
      const url = buildUrl(api.reviews.generateAi.path, { widgetId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate review");
      }
      return api.reviews.generateAi.responses[200].parse(await res.json());
    },
    onSuccess: async (_, { widgetId }) => {
      // Force refetch instead of just invalidate
      await queryClient.refetchQueries({ queryKey: [api.reviews.list.path, widgetId] });
      toast({
        title: "Review Generated",
        description: "AI review has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================
// PERSONAS
// ============================================

export function useWidgetPersonas(widgetId: number) {
  return useQuery({
    queryKey: [api.personas.list.path, widgetId],
    queryFn: async () => {
      const url = buildUrl(api.personas.list.path, { widgetId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch personas");
      return api.personas.list.responses[200].parse(await res.json());
    },
    enabled: !isNaN(widgetId),
  });
}

export function useSeedPersonas() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (widgetId: number) => {
      const url = buildUrl(api.personas.seed.path, { widgetId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to seed personas");
      return api.personas.seed.responses[201].parse(await res.json());
    },
    onSuccess: (_, widgetId) => {
      queryClient.invalidateQueries({ queryKey: [api.personas.list.path, widgetId] });
      toast({
        title: "Personas Loaded",
        description: "Personas have been loaded successfully.",
      });
    },
  });
}
