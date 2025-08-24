'use client';

import Link from "next/link";
import { useState } from "react";
import { useSOPReview, useAPIHealth } from "../lib/hooks";
import { StatusBadge, ErrorMessage, LoadingSpinner } from "../components/ui";
import { ReviewResult } from "../components/ReviewResult";

export default function Home() {
  const [quickReviewText, setQuickReviewText] = useState('');
  const { reviewSOP, isLoading, result, error, clearResult } = useSOPReview();
  const { isHealthy, isChecking } = useAPIHealth();

  const handleQuickReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReviewText.trim()) return;

    try {
      await reviewSOP(quickReviewText.trim());
    } catch (err) {
      // Error is handled by the hook
      console.error('Review failed:', err);
    }
  };

  const handleStartOver = () => {
    clearResult();
    setQuickReviewText('');
  };

  // Show results if available
  if (result) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ReviewResult result={result} onStartOver={handleStartOver} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        {/* Header with API status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              UniCompass SOP Agent
            </h1>
            <StatusBadge isHealthy={isHealthy} isChecking={isChecking} />
          </div>
          <p className="text-lg text-gray-600">
            Welcome to the UniCompass Statement of Purpose (SOP) review agent. Get actionable feedback on your SOP drafts using AI and semantic search.
          </p>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link 
            href="/review" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors font-medium"
          >
            📝 Full SOP Review
          </Link>
          <Link 
            href="/history" 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-center hover:bg-gray-300 transition-colors font-medium"
          >
            📚 Review History
          </Link>
          <Link 
            href="/examples" 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-center hover:bg-gray-300 transition-colors font-medium"
          >
            ✨ Sample SOPs
          </Link>
        </div>

        {/* Quick Review Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            ⚡ Quick SOP Review
          </h2>
          
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => clearResult()}
              className="mb-4"
            />
          )}

          <form onSubmit={handleQuickReview} className="space-y-4">
            <div>
              <textarea
                value={quickReviewText}
                onChange={(e) => setQuickReviewText(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Paste a portion of your SOP here for a quick analysis..."
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Characters: {quickReviewText.length} / 2000 recommended for quick review
                </p>
                {quickReviewText.length > 2000 && (
                  <p className="text-sm text-amber-600">
                    ⚠️ Use Full Review for longer texts
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !quickReviewText.trim() || !isHealthy}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Analyzing...
                </>
              ) : !isHealthy ? (
                'API Disconnected - Please Try Later'
              ) : (
                '🚀 Quick Analysis'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">What we analyze:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <span>📋</span> Structure & organization
              </div>
              <div className="flex items-center gap-2">
                <span>📝</span> Content relevance
              </div>
              <div className="flex items-center gap-2">
                <span>✍️</span> Writing style & clarity
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span> Goal alignment
              </div>
              <div className="flex items-center gap-2">
                <span>🔍</span> Grammar & language
              </div>
              <div className="flex items-center gap-2">
                <span>📊</span> Sentiment analysis
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} UniCompass SOP Agent. Powered by Next.js & Gemini AI.
        </footer>
      </div>
    </div>
  );
}

