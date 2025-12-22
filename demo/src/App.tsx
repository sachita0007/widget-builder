import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";


import Dashboard from "@/pages/Dashboard";
import CampaignDetail from "@/pages/CampaignDetail";
import WidgetEditor from "@/pages/WidgetEditor";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Default to Dashboard for root path */}
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />

      {/* Keep explicit dashboard route for backward compatibility or direct links */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/editor/:id">
        <ProtectedRoute component={WidgetEditor} />
      </Route>
      <Route path="/campaign/:id">
        <ProtectedRoute component={CampaignDetail} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
