// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5003';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// JWT token generation - in production, this should be handled by proper auth
const generateJWTToken = (): string => {
  // This is a mock implementation - in production, get token from auth provider
  // Pre-generated valid JWT token for demo_user
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtb191c2VyIn0.BEOb5QrV8VHHFkQP1VblQxSeqyTZp2Adv6zRh7EZ9ug';
};

export interface SOPReviewRequest {
  draft: string;
}

export interface SOPReviewResponse {
  id: string;
  timestamp: string;
  draft: string;
  feedback: string[];
  cues: string[];
  context_used: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  draft: string;
  feedback: string[];
  cues: string[];
}

// API client with timeout and error handling
class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${generateJWTToken()}`,
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  async reviewSOP(draft: string): Promise<SOPReviewResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/review`, {
        method: 'POST',
        body: JSON.stringify({ 
          draft,
          user_id: 'demo_user' // Add required user_id field
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error instanceof Error ? error : new Error('Failed to review SOP');
    }
  }

  async getHistory(): Promise<HistoryEntry[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/history?user_id=demo_user`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('API Error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch history');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Helper functions
export const formatScore = (score: number): string => {
  return `${Math.round(score)}/100`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBackground = (score: number): string => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};