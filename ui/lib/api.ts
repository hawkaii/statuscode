// API utility for backend communication
const API_BASE_URL = 'http://139.84.170.181'; // Vultr backend URL

export interface ResumeAnalysisResult {
  ats_score: number;
  feedback: string[];
}

export interface OCRAnalysisResult {
  extracted_text: string;
  confidence: number;
}

export interface SOPGenerationRequest {
  prompt: string;
  context?: {
    target_program?: string;
    university?: string;
    user_background?: string;
  };
}

export interface SOPGenerationResult {
  generated_sop: string;
  metadata?: {
    word_count: number;
    confidence_score?: number;
  };
}

export interface SOPAnalysisResult {
  ai_enhanced: boolean;
  analysis: {
    word_count: number;
    paragraph_count: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

export interface SOPEnhancementResult {
  enhancement: {
    original_text: string;
    suggestions: string[];
    enhanced_sections: Record<string, string>;
    improvement_areas: string[];
  };
}

export interface SOPAnalysisRequest {
  text: string;
  options?: {
    enhance?: boolean;
  };
}

export interface SOPEnhancementRequest {
  text: string;
  context?: {
    target_program?: string;
    university?: string;
  };
}

export interface UniversityPredictionRequest {
  researchExp?: number;
  industryExp?: number;
  toeflScore?: number;
  gmatA?: number;
  cgpa?: number;
  gmatQ?: number;
  cgpaScale?: number;
  gmatV?: number;
  gre_total?: number;
  researchPubs?: number;
  univName?: string;
}

export interface UniversityPredictionResult {
  univName: string;
  p_admit: number;
}

export class ResumeAPI {
  static async analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze_resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: resumeText
        })
      });

      if (!response.ok) {
        throw new Error(`Resume analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  static async uploadOCRResume(file: File): Promise<OCRAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/ocr_resume`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OCR upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OCR upload error:', error);
      throw error;
    }
  }
}

export class SOPAPI {
  static async generateSOP(request: SOPGenerationRequest): Promise<SOPGenerationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sop/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`SOP generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SOP generation error:', error);
      throw error;
    }
  }

  static async analyzeSOP(request: SOPAnalysisRequest): Promise<SOPAnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sop/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`SOP analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SOP analysis error:', error);
      throw error;
    }
  }

  static async enhanceSOP(request: SOPEnhancementRequest): Promise<SOPEnhancementResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sop/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`SOP enhancement failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SOP enhancement error:', error);
      throw error;
    }
  }
}

export class UniversityAPI {
  static async predictUniversities(request: UniversityPredictionRequest): Promise<UniversityPredictionResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`University prediction failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('University prediction error:', error);
      throw error;
    }
  }
}
