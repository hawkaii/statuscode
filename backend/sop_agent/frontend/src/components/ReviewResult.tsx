import React from 'react';
import { SOPReviewResponse, formatDate } from '../lib/api';

interface ReviewResultProps {
  result: SOPReviewResponse;
  onStartOver: () => void;
}

export function ReviewResult({ result, onStartOver }: ReviewResultProps) {
  const { feedback, cues, timestamp, context_used } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Complete</h2>
            <p className="text-gray-700">Here&apos;s your comprehensive SOP feedback</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Reviewed on {formatDate(timestamp)}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Context Used: {context_used} examples
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Feedback */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📝 Detailed Feedback
            </h3>
            <div className="space-y-3">
              {feedback.map((item, index) => (
                <div key={index} className="text-gray-700 text-sm leading-relaxed border-l-4 border-blue-200 pl-4">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cues & Tips */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💡 Improvement Cues
          </h3>
          {cues.length > 0 && cues[0] !== '' ? (
            <ul className="space-y-3">
              {cues.map((cue, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{cue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm italic">
              No specific improvement cues provided. The feedback above contains actionable suggestions.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <button
          onClick={onStartOver}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Review Another SOP
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Print Results
        </button>
      </div>
    </div>
  );
}