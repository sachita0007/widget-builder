
import { Link, useRoute } from "wouter";
import { useWidget, useWidgetReviews, useWidgetPersonas } from "@/hooks/use-widgets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Edit2, BarChart3, Users, ThumbsUp, ShoppingBag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CampaignDetail() {
    const [, params] = useRoute("/campaign/:id");
    const id = Number(params?.id);

    const { data: widget, isLoading: widgetLoading } = useWidget(id);
    const { data: reviews, isLoading: reviewsLoading } = useWidgetReviews(id);
    const { data: personas, isLoading: personasLoading } = useWidgetPersonas(id);

    if (widgetLoading || reviewsLoading || personasLoading) {
        return <CampaignDetailSkeleton />;
    }

    if (!widget) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Campaign not found</h2>
                    <Link href="/">
                        <Button variant="ghost" className="mt-4">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate Metrics
    const totalReviews = reviews?.length || 0;
    const avgRating = reviews?.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    // Synthetic Insights (derived from rating for demo purposes)
    // In a real app, these would come from specific MCQ answers
    const positiveReviews = reviews?.filter(r => r.rating >= 4).length || 0;
    const repurchaseIntent = totalReviews ? Math.round((positiveReviews / totalReviews) * 0.85 * 100) : 0; // assume 85% of positive reviewers would buy again
    const recommendationRate = totalReviews ? Math.round((reviews?.filter(r => r.rating >= 3).length || 0) / totalReviews * 100) : 0;
    const verifiedCount = reviews?.filter(r => r.verified).length || 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ChevronLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                {widget.name}
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                                    Active Campaign
                                </span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/editor/${widget.id}`}>
                            <Button className="bg-slate-900 text-white gap-2">
                                <Edit2 className="w-4 h-4" /> Open Widget Builder
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified Samples</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{verifiedCount}</div>
                            <p className="text-xs text-muted-foreground">verified consumers tested</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgRating}</div>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div key={star} className={`h-1.5 w-full rounded-full ${parseFloat(avgRating) >= star ? 'bg-yellow-400' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Repurchase Intent</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{repurchaseIntent}%</div>
                            <Progress value={repurchaseIntent} className="h-2 mt-2 bg-slate-100" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">94%</div>
                            <p className="text-xs text-muted-foreground">participants finished full survey</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Deep Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Campaign Insights</h2>

                        <Card>
                            <CardHeader>
                                <CardTitle>Why consumers liked it</CardTitle>
                                <CardDescription>Top themes extracted from structured responses</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Mocked Themes */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Better taste than previous brand</span>
                                        <span className="font-bold">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Visible coat improvement</span>
                                        <span className="font-bold">64%</span>
                                    </div>
                                    <Progress value={64} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Easy digestion</span>
                                        <span className="font-bold">41%</span>
                                    </div>
                                    <Progress value={41} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Demographic Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm font-medium text-slate-500 mb-1">Top Age Group</div>
                                        <div className="text-lg font-bold">Cats 1-3 Years</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm font-medium text-slate-500 mb-1">Dominant Region</div>
                                        <div className="text-lg font-bold">Metro Cities</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Action */}
                    <div className="space-y-6">
                        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl">
                            <h3 className="tex-lg font-bold mb-2">Ready to showcase?</h3>
                            <p className="text-blue-200 text-sm mb-6">
                                Your campaign has collected enough verified data to display a high-trust card.
                            </p>
                            <Link href={`/editor/${widget.id}`}>
                                <Button className="w-full bg-white text-blue-900 hover:bg-blue-50">
                                    Go to Widget Builder <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

function CampaignDetailSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="h-16 bg-white border-b border-slate-200" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
}
