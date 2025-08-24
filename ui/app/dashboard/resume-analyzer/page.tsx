"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Zap,
  Target,
  BarChart3,
  Star,
  Activity,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeAPI, type ResumeAnalysisResult, type OCRAnalysisResult } from "@/lib/api";

export default function ResumeAnalyzerPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [resumeAnalysisResults, setResumeAnalysisResults] = useState<ResumeAnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setError(null);
    setIsExtractingText(true);

    try {
      // Step 1: OCR extraction
      console.log("Starting OCR extraction...");
      const ocrResult = await ResumeAPI.uploadOCRResume(file);
      setExtractedText(ocrResult.extracted_text);
      console.log("OCR completed, extracted text length:", ocrResult.extracted_text.length);

      // Step 2: Resume analysis
      setIsExtractingText(false);
      setIsAnalyzing(true);
      console.log("Starting resume analysis...");

      const analysisResult = await ResumeAPI.analyzeResume(ocrResult.extracted_text);
      setResumeAnalysisResults(analysisResult);
      console.log("Analysis completed, score:", analysisResult.ats_score);

      setIsAnalyzing(false);
      setAnalysisComplete(true);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
      setIsExtractingText(false);
      setIsAnalyzing(false);
    }
  };

  // Transform API results into modern display format
  const transformedResults = resumeAnalysisResults ? {
    overallScore: resumeAnalysisResults.ats_score,
    feedback: resumeAnalysisResults.feedback,
    insights: [
      {
        icon: Target,
        title: "ATS SCORE",
        value: `${resumeAnalysisResults.ats_score}/100`,
        status: resumeAnalysisResults.ats_score >= 80 ? "excellent" : resumeAnalysisResults.ats_score >= 60 ? "good" : "needs-improvement",
        color: resumeAnalysisResults.ats_score >= 80 ? "text-secondary" : resumeAnalysisResults.ats_score >= 60 ? "text-primary" : "text-destructive"
      },
      {
        icon: Activity,
        title: "CONTENT LENGTH",
        value: `${extractedText.length} chars`,
        status: extractedText.length > 1000 ? "excellent" : extractedText.length > 500 ? "good" : "needs-improvement",
        color: extractedText.length > 1000 ? "text-secondary" : extractedText.length > 500 ? "text-primary" : "text-destructive"
      },
      {
        icon: Layers,
        title: "STRUCTURE",
        value: "Analyzed",
        status: "good",
        color: "text-primary"
      },
      {
        icon: Star,
        title: "OVERALL RATING",
        value: resumeAnalysisResults.ats_score >= 80 ? "EXCELLENT" : resumeAnalysisResults.ats_score >= 60 ? "GOOD" : "NEEDS WORK",
        status: resumeAnalysisResults.ats_score >= 80 ? "excellent" : resumeAnalysisResults.ats_score >= 60 ? "good" : "needs-improvement",
        color: resumeAnalysisResults.ats_score >= 80 ? "text-secondary" : resumeAnalysisResults.ats_score >= 60 ? "text-primary" : "text-destructive"
      }
    ]
  } : null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-secondary";
    if (score >= 75) return "text-primary";
    return "text-destructive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-secondary";
      case "good": return "bg-primary";
      case "needs-improvement": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-card neo-border neo-shadow-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary flex items-center justify-center neo-border">
              <FileText className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-primary">
                Resume Analyzer
              </h1>
              <p className="text-muted-foreground font-bold uppercase tracking-wider">
                Optimize your resume for higher studies applications
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 bg-secondary neo-border transform -skew-x-12"></div>
            <div className="w-12 h-2 bg-primary neo-border transform skew-x-12"></div>
          </div>
        </div>

        {!uploadedFile ? (
          /* Upload Section */
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted flex items-center justify-center neo-border mx-auto mb-6">
                <Upload className="w-10 h-10 text-muted-foreground" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
                Upload Your Resume
              </h2>

              <p className="text-muted-foreground mb-6 font-medium">
                Upload your resume in PDF or DOC format for comprehensive analysis
              </p>

              <div className="space-y-4">
                <Label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="p-8 border-4 border-dashed border-border hover:border-primary transition-colors neo-shadow bg-background hover:bg-accent">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-bold uppercase tracking-wider">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                </Label>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="font-black uppercase tracking-wider text-lg">
                  What We Analyze:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    "Personal Information & Contact",
                    "Education & Academic Performance",
                    "Work Experience & Internships",
                    "Skills & Technical Proficiency",
                    "Test Scores (GRE, IELTS, etc.)",
                    "Extracurricular Activities"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isExtractingText ? (
          /* OCR Extraction Section */
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-accent flex items-center justify-center neo-border mx-auto mb-6 animate-pulse">
                <Upload className="w-10 h-10 text-accent-foreground" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
                EXTRACTING TEXT
              </h2>

              <p className="text-muted-foreground mb-6 font-medium">
                Our OCR is reading your resume...
              </p>

              <div className="space-y-3">
                {[
                  "Reading document structure",
                  "Extracting text content",
                  "Processing formatting",
                  "Preparing for analysis"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background neo-border">
                    <div className="w-6 h-6 bg-accent neo-border animate-spin"></div>
                    <span className="font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isAnalyzing ? (
          /* Analyzing Section */
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary flex items-center justify-center neo-border mx-auto mb-6 animate-pulse">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
                ANALYZING CONTENT
              </h2>

              <p className="text-muted-foreground mb-6 font-medium">
                AI is evaluating your resume...
              </p>

              <div className="space-y-3">
                {[
                  "Scoring ATS compatibility",
                  "Analyzing keyword optimization",
                  "Evaluating action verbs",
                  "Generating feedback"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background neo-border">
                    <div className="w-6 h-6 bg-primary neo-border animate-spin"></div>
                    <span className="font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          /* Error Section */
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-destructive flex items-center justify-center neo-border mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
                Analysis Failed
              </h2>
              <p className="text-muted-foreground mb-6 font-medium">
                {error}
              </p>
              <Button onClick={() => setUploadedFile(null)} className="font-bold uppercase tracking-wider">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          /* Modern Neo-Brutalism Results Section */
          <div className="space-y-8">
            {/* Hero Score Display */}
            <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-8 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className={cn(
                      "w-32 h-32 neo-border-thick neo-shadow-xl flex items-center justify-center text-5xl font-black",
                      transformedResults?.overallScore >= 80 ? "bg-secondary text-secondary-foreground" :
                      transformedResults?.overallScore >= 60 ? "bg-primary text-primary-foreground" :
                      "bg-destructive text-destructive-foreground"
                    )}>
                      {transformedResults?.overallScore}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent neo-border neo-shadow rotate-12">
                      <Star className="w-6 h-6 text-accent-foreground m-1" />
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-4">
                  ATS SCORE: {transformedResults?.overallScore}/100
                </h2>

                <p className="text-xl font-bold uppercase tracking-wider text-muted-foreground">
                  {transformedResults?.overallScore >= 80 ? "EXCELLENT! READY FOR SUBMISSION" :
                   transformedResults?.overallScore >= 60 ? "GOOD! MINOR IMPROVEMENTS NEEDED" :
                   "NEEDS WORK! SIGNIFICANT IMPROVEMENTS REQUIRED"}
                </p>
              </div>
            </div>

            {/* Modern Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transformedResults?.insights.map((insight, index) => (
                <div key={index} className="bg-card neo-border neo-shadow-xl p-6 text-center group hover:transform hover:translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-accent neo-border neo-shadow mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <insight.icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-2">
                    {insight.title}
                  </h3>
                  <div className={cn("text-2xl font-black uppercase tracking-wider", insight.color)}>
                    {insight.value}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Feedback Section */}
            <div className="bg-card neo-border neo-shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary neo-border neo-shadow flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-wider">
                  AI ANALYSIS FEEDBACK
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformedResults?.feedback.map((feedback, index) => (
                  <div key={index} className="bg-background neo-border neo-shadow p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-secondary neo-border neo-shadow flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        {feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Text Preview */}
            <div className="bg-card neo-border neo-shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent neo-border neo-shadow flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-wider">
                  EXTRACTED CONTENT
                </h2>
              </div>

              <div className="bg-background neo-border neo-shadow p-6 max-h-64 overflow-y-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {extractedText || "No text extracted"}
                </pre>
              </div>
            </div>

            {/* Action Panel */}
            <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-8">
              <div className="text-center">
                <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                  READY TO IMPROVE?
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-secondary text-secondary-foreground neo-border neo-shadow-xl hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 font-black uppercase tracking-wider px-8 py-4 text-lg"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    GET IMPROVEMENT TIPS
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="neo-border neo-shadow-xl hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 font-black uppercase tracking-wider px-8 py-4 text-lg"
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisComplete(false);
                      setResumeAnalysisResults(null);
                      setExtractedText("");
                      setError(null);
                    }}
                  >
                    <Upload className="w-6 h-6 mr-3" />
                    ANALYZE ANOTHER RESUME
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}