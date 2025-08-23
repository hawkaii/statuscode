'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSOPReview, useAPIHealth } from '../../lib/hooks';
import { StatusBadge, ErrorMessage, LoadingSpinner } from '../../components/ui';
import { ReviewResult } from '../../components/ReviewResult';

export default function ReviewPage() {
  const [sopText, setSopText] = useState('');
  const { reviewSOP, isLoading, result, error, clearResult } = useSOPReview();
  const { isHealthy, isChecking } = useAPIHealth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopText.trim()) return;

    try {
      await reviewSOP(sopText.trim());
    } catch (err) {
      // Error is handled by the hook
      console.error('Review failed:', err);
    }
  };

  const handleStartOver = () => {
    clearResult();
    setSopText('');
  };

  const wordCount = sopText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isTextTooShort = wordCount < 50;
  const isTextTooLong = wordCount > 2000;

  // Show results if available
  if (result) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
          <ReviewResult result={result} onStartOver={handleStartOver} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📝 Complete SOP Review
              </h1>
              <p className="text-lg text-gray-600">
                Submit your full Statement of Purpose for comprehensive analysis and detailed feedback.
              </p>
            </div>
            <StatusBadge isHealthy={isHealthy} isChecking={isChecking} />
          </div>

          {/* Error Display */}
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => clearResult()}
              className="mb-6"
            />
          )}

          {/* API Health Warning */}
          {!isHealthy && !isChecking && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-600">⚠️</span>
                <span className="text-amber-800 font-medium">API Connection Issue</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Unable to connect to the analysis service. Please check your internet connection or try again later.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="sop" className="block text-sm font-medium text-gray-700 mb-3">
                Your Statement of Purpose *
              </label>
              <textarea
                id="sop"
                value={sopText}
                onChange={(e) => setSopText(e.target.value)}
                className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
                placeholder="Paste your complete Statement of Purpose here...

Tips for best results:
• Include your complete SOP (300-1000 words recommended)
• Make sure to include introduction, body paragraphs, and conclusion
• Include specific examples and experiences
• Mention your goals and how they align with the program"
                required
                disabled={isLoading}
              />
              
              {/* Text Statistics */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-600">
                    <strong>Words:</strong> {wordCount}
                  </span>
                  <span className="text-gray-600">
                    <strong>Characters:</strong> {sopText.length}
                  </span>
                  <span className="text-gray-600">
                    <strong>Paragraphs:</strong> {sopText.split(/\n\s*\n/).filter(p => p.trim()).length}
                  </span>
                </div>
                
                {/* Word Count Warnings */}
                <div className="text-sm">
                  {isTextTooShort && sopText.length > 0 && (
                    <span className="text-amber-600">⚠️ Too short (min 50 words)</span>
                  )}
                  {isTextTooLong && (
                    <span className="text-amber-600">⚠️ Very long (may take longer to process)</span>
                  )}
                  {wordCount >= 50 && wordCount <= 2000 && (
                    <span className="text-green-600">✅ Good length</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || !sopText.trim() || isTextTooShort || !isHealthy}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 font-medium"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Analyzing your SOP...</span>
                  </>
                ) : !isHealthy ? (
                  '🔌 API Disconnected'
                ) : isTextTooShort ? (
                  '📝 Need more content'
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Analyze My SOP</span>
                  </>
                )}
              </button>
              
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
              >
                ← Back to Home
              </Link>

              {sopText && (
                <button
                  type="button"
                  onClick={() => setSopText('')}
                  className="text-red-600 hover:text-red-700 px-4 py-3 text-sm underline"
                >
                  Clear Text
                </button>
              )}
            </div>
          </form>

          {/* Analysis Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                🔍 What We Analyze
              </h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Structure and logical flow
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Content quality and relevance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Writing style and clarity
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Goal alignment with program
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Grammar and language usage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Sentiment and tone analysis
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                💡 You&apos;ll Get
              </h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Overall score out of 100
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Detailed section-by-section feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Specific improvement suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Readability and sentiment scores
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Printable results for reference
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Save to history for tracking
                </li>
              </ul>
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <LoadingSpinner color="blue" />
                <span className="text-blue-800 font-medium">Analysis in Progress...</span>
              </div>
              <p className="text-sm text-blue-700">
                Our AI is carefully reviewing your SOP. This may take 30-60 seconds depending on the length and complexity of your statement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
