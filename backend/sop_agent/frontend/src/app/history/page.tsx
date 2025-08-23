'use client';

import Link from 'next/link';
import { useHistory } from '../../lib/hooks';
import { formatDate, truncateText, HistoryEntry } from '../../lib/api';
import { LoadingSpinner, ErrorMessage, Card } from '../../components/ui';

export default function HistoryPage() {
  const { history, isLoading, error, refetch } = useHistory();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              📚 Review History
            </h1>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-lg text-gray-600">
            View your previous SOP reviews and track your improvement over time.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your review history...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={refetch}
            className="mb-6"
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && history.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t submitted any SOPs for review yet. Start by reviewing your first SOP!
            </p>
            <Link
              href="/review"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Review Your First SOP
            </Link>
          </Card>
        )}

        {/* History List */}
        {!isLoading && !error && history.length > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{history.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {history.length > 0 ? Math.round(history.reduce((acc, item) => acc + item.feedback.length, 0) / history.length) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg Feedback Points</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Last Review</div>
              </div>
            </div>

            {/* History Items */}
            <div className="space-y-4">
              {history.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination placeholder */}
            {history.length >= 10 && (
              <div className="text-center py-6">
                <p className="text-gray-500">Showing {history.length} most recent reviews</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface HistoryItemProps {
  item: HistoryEntry;
}

function HistoryItem({ item }: HistoryItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              SOP Review #{item.id.slice(-6)}
            </h3>
            <span className="text-sm text-gray-500">
              {formatDate(item.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {truncateText(item.draft, 200)}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Feedback Points:</span>
              <span className="text-lg font-bold text-blue-600">
                {item.feedback.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Improvement Cues:</span>
              <span className="text-lg font-bold text-green-600">
                {item.cues.filter(c => c.trim() !== '').length}
              </span>
            </div>
            
            <button
              onClick={() => {
                // TODO: Implement view full review
                alert('View full review feature coming soon!');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              View Full Review
            </button>
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
            {item.feedback.length}
            <br />
            <span className="text-xs">Points</span>
          </div>
        </div>
      </div>
    </Card>
  );
}