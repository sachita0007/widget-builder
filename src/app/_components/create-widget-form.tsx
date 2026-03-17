
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

export function CreateWidgetForm({ campaignId }: { campaignId: string }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [ratingQuestionId, setRatingQuestionId] = useState("");
    const [selectedTextQuestionIds, setSelectedTextQuestionIds] = useState<string[]>([]);

    // Fetch questions for this campaign
    const { data: questions, isLoading: questionsLoading } = api.campaign.getQuestions.useQuery({ campaignId });

    const createWidget = api.widget.create.useMutation({
        onSuccess: (widget) => {
            router.push(`/widget/${widget.id}/edit`);
            router.refresh();
        }
    });

    const handleToggleTextQuestion = (questionId: string) => {
        setSelectedTextQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createWidget.mutate({
            name,
            campaignId,
            template: "AGGREGATED",
            settings: {
                ratingQuestionId: ratingQuestionId || undefined,
                reviewTextQuestionIds: selectedTextQuestionIds.length > 0
                    ? selectedTextQuestionIds.join(",")
                    : undefined,
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Create New Widget</h2>
                    <Link href={`/campaign/${campaignId}`} className="text-slate-400 hover:text-slate-600 transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Widget Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900 placeholder-slate-400"
                        placeholder="e.g. Homepage Reviews"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Question Selectors */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-3">Question Mapping</p>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Rating Question</label>
                        <p className="text-xs text-slate-400 mb-2">Which question captures the star rating?</p>
                        <select
                            value={ratingQuestionId}
                            onChange={(e) => setRatingQuestionId(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900 text-sm"
                        >
                            <option value="">— Select question —</option>
                            {questionsLoading && <option disabled>Loading...</option>}
                            {questions?.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.text}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Review Text Questions</label>
                        <p className="text-xs text-slate-400 mb-2">Select one or more questions that capture review text. The first non-empty response per reviewer will be used.</p>
                        {questionsLoading && <p className="text-xs text-slate-400">Loading...</p>}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {questions?.map((q) => (
                                <label key={q.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTextQuestionIds.includes(q.id)}
                                        onChange={() => handleToggleTextQuestion(q.id)}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">{q.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={createWidget.isPending}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {createWidget.isPending ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </>
                    ) : (
                        "Create Widget"
                    )}
                </button>
            </form>
        </div>
    )
}
