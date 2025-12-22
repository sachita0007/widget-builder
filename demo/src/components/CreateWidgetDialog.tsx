import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWidgetSchema, type InsertWidget } from "@shared/schema";
import { useCreateWidget } from "@/hooks/use-widgets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";

export function CreateWidgetDialog() {
  const [open, setOpen] = useState(false);
  const createWidget = useCreateWidget();

  const form = useForm<InsertWidget>({
    resolver: zodResolver(insertWidgetSchema),
    defaultValues: {
      name: "",
      templateType: "aggregated",
      primaryColor: "#5d2d88", // Whiskas default
      secondaryColor: "#ffffff",
      userId: "", // Handled by backend or hook context if needed, but schema requires it. 
      // NOTE: In a real app, backend extracts userId from session. 
      // For this demo with schema validation, we might need to handle it.
      // However, replit auth usually attaches it on backend. 
      // The insertSchema expects userId. Let's assume the hook handles it or we mock it.
    }
  });

  // HACK: For this specific template, we need to pass a userId to satisfy Zod client-side
  // In a real app, we'd omit userId from the client-side schema.
  // We'll rely on the server to overwrite/validate the user.
  const onSubmit = (data: InsertWidget) => {
    // Pass a dummy ID if needed by Zod, backend will override with session ID
    createWidget.mutate({ ...data, userId: "current-user" }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Target Product</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Whiskas Dry Food - 2024" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={createWidget.isPending}
            >
              {createWidget.isPending ? "Starting Setup..." : "Start Campaign Setup"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
