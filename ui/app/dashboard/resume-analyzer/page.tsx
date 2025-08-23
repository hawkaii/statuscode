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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResumeAnalyzerPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const analysisResults = {
    overallScore: 85,
    sections: [
      {
        icon: User,
        title: "Personal Information",
        score: 95,
        status: "excellent",
        issues: [],
        suggestions: ["Consider adding LinkedIn profile"]
      },
      {
        icon: GraduationCap,
        title: "Education",
        score: 90,
        status: "good",
        issues: ["Missing GPA/CGPA"],
        suggestions: ["Add GPA if 3.5+", "Include relevant coursework"]
      },
      {
        icon: Briefcase,
        title: "Work Experience",
        score: 75,
        status: "needs-improvement",
        issues: ["Lacks quantified achievements", "Missing internship details"],
        suggestions: ["Add metrics and numbers", "Include project outcomes"]
      },
      {
        icon: Award,
        title: "Skills & Certifications",
        score: 80,
        status: "good",
        issues: ["Skills not categorized"],
        suggestions: ["Group technical vs soft skills", "Add proficiency levels"]
      },
      {
        icon: Globe,
        title: "Test Scores",
        score: 70,
        status: "needs-improvement",
        issues: ["Missing GRE/IELTS scores"],
        suggestions: ["Add standardized test scores", "Include score dates"]
      }
    ]
  };

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
        ) : isAnalyzing ? (
          /* Analyzing Section */
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary flex items-center justify-center neo-border mx-auto mb-6 animate-pulse">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
                Analyzing Your Resume
              </h2>

              <p className="text-muted-foreground mb-6 font-medium">
                Our AI is carefully reviewing your resume...
              </p>

              <div className="space-y-3">
                {[
                  "Extracting personal information",
                  "Analyzing education details",
                  "Evaluating work experience",
                  "Checking skills and certifications",
                  "Generating improvement suggestions"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background neo-border">
                    <div className="w-6 h-6 bg-primary neo-border animate-spin"></div>
                    <span className="font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-card neo-border neo-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase tracking-wider">
                  Overall Score
                </h2>
                <div className="text-right">
                  <div className={cn("text-4xl font-black", getScoreColor(analysisResults.overallScore))}>
                    {analysisResults.overallScore}/100
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Good Progress
                  </p>
                </div>
              </div>

              <div className="w-full bg-muted neo-border h-4">
                <div
                  className="h-full bg-primary neo-border-0"
                  style={{ width: `${analysisResults.overallScore}%` }}
                ></div>
              </div>
            </div>

            {/* Section Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResults.sections.map((section, index) => (
                <div key={index} className="bg-card neo-border neo-shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-10 h-10 flex items-center justify-center neo-border", getStatusColor(section.status))}>
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <div className={cn("text-lg font-bold", getScoreColor(section.score))}>
                        {section.score}/100
                      </div>
                    </div>
                  </div>

                  {section.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold uppercase tracking-wider text-sm text-destructive mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Issues Found
                      </h4>
                      <ul className="space-y-1">
                        {section.issues.map((issue, issueIndex) => (
                          <li key={issueIndex} className="text-sm bg-destructive/10 p-2 neo-border border-destructive">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-sm text-secondary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {section.suggestions.map((suggestion, suggestionIndex) => (
                        <li key={suggestionIndex} className="text-sm bg-secondary/10 p-2 neo-border border-secondary">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-card neo-border neo-shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Improved Resume
                </Button>
                <Button variant="outline" className="flex-1 font-bold uppercase tracking-wider">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Version
                </Button>
                <Button variant="outline" onClick={() => setUploadedFile(null)} className="flex-1 font-bold uppercase tracking-wider">
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}