import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const colorClasses = {
  blue: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-600',
};

export function LoadingSpinner({ size = 'md', color = 'blue', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  isHealthy: boolean | null;
  isChecking: boolean;
}

export function StatusBadge({ isHealthy, isChecking }: StatusBadgeProps) {
  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <LoadingSpinner size="sm" color="gray" />
        <span>Checking API...</span>
      </div>
    );
  }

  if (isHealthy === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <span>Unknown</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{isHealthy ? 'API Connected' : 'API Disconnected'}</span>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', title, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg border border-gray-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}