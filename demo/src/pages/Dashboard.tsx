import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useWidgets, useDeleteWidget } from "@/hooks/use-widgets";
import { CreateWidgetDialog } from "@/components/CreateWidgetDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, LogOut, Edit2, Trash2, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: widgets, isLoading } = useWidgets();
  const deleteWidget = useDeleteWidget();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">Freestand</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              Signed in as <span className="font-semibold text-slate-900">{user?.firstName || user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="text-slate-500 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Campaigns</h1>
            <p className="text-slate-500 mt-1">Manage your product sampling campaigns.</p>
          </div>
          <CreateWidgetDialog />
        </div>

        {widgets && widgets.length > 0 ? (
          <div className="space-y-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="group bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-500`}>
                    {widget.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/campaign/${widget.id}`}>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer truncate">
                        {widget.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="capitalize">{widget.templateType} Campaign</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{new Date(widget.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Active
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/campaign/${widget.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 hover:bg-slate-50">
                        <ArrowRight className="w-4 h-4" /> View
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the campaign and remove it from any sites where it is embedded.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteWidget.mutate(widget.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No campaigns yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Create your first campaign to start collecting verified data.</p>
            <CreateWidgetDialog />
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-16 bg-white border-b border-slate-200 mb-10" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
