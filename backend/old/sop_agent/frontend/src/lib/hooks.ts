import { useState, useEffect, useCallback } from 'react';
import { apiClient, SOPReviewResponse, HistoryEntry } from './api';

// Hook for SOP review functionality
export function useSOPReview() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SOPReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reviewSOP = useCallback(async (draft: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.reviewSOP(draft);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to review SOP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    reviewSOP,
    clearResult,
    isLoading,
    result,
    error,
  };
}

// Hook for history functionality
export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const historyData = await apiClient.getHistory();
      setHistory(historyData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}

// Hook for API health check
export function useAPIHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const healthy = await apiClient.checkHealth();
      setIsHealthy(healthy);
      return healthy;
    } catch {
      setIsHealthy(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    isChecking,
    checkHealth,
  };
}