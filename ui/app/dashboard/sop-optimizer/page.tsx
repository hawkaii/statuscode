"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  PenTool,
  Sparkles,
  FileText,
  Download,
  Save,
  Eye,
  CheckCircle,
  AlertTriangle,
  BarChart,
  Lightbulb,
  Target,
  Clock,
  Zap,
  Star,
  Activity,
  TrendingUp,
  Award,
  Layers,
  Users,
  Globe,
  Shield,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SOPAPI, type SOPAnalysisResult, type SOPEnhancementResult } from "@/lib/api";

export default function SOPOptimizerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sopData, setSopData] = useState({
    university: "",
    program: "",
    content: "",
    selectedTemplate: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<SOPAnalysisResult | null>(null);
  const [enhancementResults, setEnhancementResults] = useState<SOPEnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const templates = [
    {
      id: "engineering",
      title: "Engineering Programs",
      description: "For MS/PhD in Engineering fields",
      tags: ["Technical", "Research-focused", "Innovation"],
      preview: "As an aspiring engineer with a passion for innovation..."
    },
    {
      id: "business",
      title: "Business & Management",
      description: "For MBA and business programs",
      tags: ["Leadership", "Strategic", "Professional"],
      preview: "My entrepreneurial journey began during my undergraduate..."
    },
    {
      id: "computer-science",
      title: "Computer Science",
      description: "For CS and related tech programs",
      tags: ["Technical", "Problem-solving", "Future-focused"],
      preview: "In an era where technology shapes every aspect..."
    },
    {
      id: "research",
      title: "Research Programs",
      description: "For PhD and research-focused degrees",
      tags: ["Academic", "Research-intensive", "Scholarly"],
      preview: "My fascination with research began when I..."
    }
  ];

  // Transform API results into display format
  const transformedResults = analysisResults ? {
    overallScore: Math.round((analysisResults.analysis.word_count / 800) * 100), // Score based on word count
    wordCount: analysisResults.analysis.word_count,
    paragraphCount: analysisResults.analysis.paragraph_count,
    aiEnhanced: analysisResults.ai_enhanced,
    strengths: analysisResults.analysis.strengths,
    weaknesses: analysisResults.analysis.weaknesses,
    suggestions: analysisResults.analysis.suggestions,
    insights: [
      {
        icon: Activity,
        title: "WORD COUNT",
        value: `${analysisResults.analysis.word_count}`,
        status: analysisResults.analysis.word_count >= 500 ? "excellent" : analysisResults.analysis.word_count >= 300 ? "good" : "needs-improvement",
        color: analysisResults.analysis.word_count >= 500 ? "text-secondary" : analysisResults.analysis.word_count >= 300 ? "text-primary" : "text-destructive"
      },
      {
        icon: Layers,
        title: "PARAGRAPHS",
        value: `${analysisResults.analysis.paragraph_count}`,
        status: analysisResults.analysis.paragraph_count >= 4 ? "excellent" : analysisResults.analysis.paragraph_count >= 2 ? "good" : "needs-improvement",
        color: analysisResults.analysis.paragraph_count >= 4 ? "text-secondary" : analysisResults.analysis.paragraph_count >= 2 ? "text-primary" : "text-destructive"
      },
      {
        icon: Star,
        title: "AI ENHANCED",
        value: analysisResults.ai_enhanced ? "YES" : "NO",
        status: analysisResults.ai_enhanced ? "excellent" : "good",
        color: analysisResults.ai_enhanced ? "text-secondary" : "text-primary"
      },
      {
        icon: Award,
        title: "OVERALL SCORE",
        value: `${Math.round((analysisResults.analysis.word_count / 800) * 100)}/100`,
        status: Math.round((analysisResults.analysis.word_count / 800) * 100) >= 80 ? "excellent" : Math.round((analysisResults.analysis.word_count / 800) * 100) >= 60 ? "good" : "needs-improvement",
        color: Math.round((analysisResults.analysis.word_count / 800) * 100) >= 80 ? "text-secondary" : Math.round((analysisResults.analysis.word_count / 800) * 100) >= 60 ? "text-primary" : "text-destructive"
      }
    ]
  } : null;

  const handleTemplateSelect = (templateId: string) => {
    setSopData({ ...sopData, selectedTemplate: templateId });
    setCurrentStep(2);
  };

  const handleAnalyze = async () => {
    if (!sopData.content.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("Starting SOP analysis...");
      const result = await SOPAPI.analyzeSOP({
        text: sopData.content,
        options: { enhance: true }
      });

      setAnalysisResults(result);
      console.log("SOP analysis completed:", result);
      setIsAnalyzing(false);
      setCurrentStep(3);
    } catch (err) {
      console.error("SOP analysis error:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
      setIsAnalyzing(false);
    }
  };

  const handleEnhance = async () => {
    if (!sopData.content.trim()) return;

    setIsEnhancing(true);
    setError(null);

    try {
      console.log("Starting SOP enhancement...");
      const result = await SOPAPI.enhanceSOP({
        text: sopData.content,
        context: {
          target_program: sopData.program || "Graduate Program",
          university: sopData.university || "Target University"
        }
      });

      setEnhancementResults(result);
      console.log("SOP enhancement completed:", result);
      setIsEnhancing(false);
    } catch (err) {
      console.error("SOP enhancement error:", err);
      setError(err instanceof Error ? err.message : "Enhancement failed");
      setIsEnhancing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-secondary";
    if (score >= 75) return "text-primary";
    if (score >= 65) return "text-accent";
    return "text-destructive";
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-card neo-border neo-shadow p-6">
        <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
          Choose Your Template
        </h2>
        <p className="text-muted-foreground mb-6 font-medium">
          Select a template that best matches your field of study and program type
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "p-6 bg-background neo-border cursor-pointer transition-all duration-200",
                "hover:transform hover:translate-x-1 hover:translate-y-1 hover:bg-accent",
                sopData.selectedTemplate === template.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <h3 className="font-black uppercase tracking-wider mb-2">
                {template.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {template.tags.map((tag, index) => (
                  <span key={index} className="bg-muted px-2 py-1 text-xs font-medium neo-border">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs italic border-l-4 border-border pl-3">
                "{template.preview}..."
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Option */}
      <div className="bg-card neo-border neo-shadow p-6">
        <div className="text-center">
          <PenTool className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-black uppercase tracking-wider mb-2">
            Start from Scratch
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Prefer to write your SOP without a template? Start with a blank document.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSopData({ ...sopData, selectedTemplate: "custom" });
              setCurrentStep(2);
            }}
            className="font-bold uppercase tracking-wider"
          >
            <PenTool className="w-4 h-4 mr-2" />
            Start Writing
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Program Details */}
      <div className="bg-card neo-border neo-shadow p-6">
        <h2 className="text-2xl font-black uppercase tracking-wider mb-4">
          Program Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="university">Target University</Label>
            <Input
              id="university"
              placeholder="Stanford University"
              value={sopData.university}
              onChange={(e) => setSopData({ ...sopData, university: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="program">Program Name</Label>
            <Input
              id="program"
              placeholder="MS Computer Science"
              value={sopData.program}
              onChange={(e) => setSopData({ ...sopData, program: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-card neo-border neo-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black uppercase tracking-wider">
            Write Your SOP
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assist
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full h-96 p-4 neo-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Begin writing your Statement of Purpose here..."
            value={sopData.content}
            onChange={(e) => setSopData({ ...sopData, content: e.target.value })}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Words: {sopData.content.split(' ').filter(word => word.length > 0).length}</span>
              <span>Characters: {sopData.content.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Auto-saved 2 min ago</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border-2 border-destructive neo-border text-destructive">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleAnalyze}
            disabled={!sopData.content.trim() || isAnalyzing}
            className="font-bold uppercase tracking-wider"
          >
            <BarChart className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze SOP"}
          </Button>
          <Button
            onClick={handleEnhance}
            disabled={!sopData.content.trim() || isEnhancing}
            variant="outline"
            className="font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isEnhancing ? "Enhancing..." : "AI Enhance"}
          </Button>
          <Button variant="outline" className="font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-card neo-border neo-shadow p-6">
        <h3 className="font-black uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Writing Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Start with a compelling hook",
            "Tell your story chronologically",
            "Be specific with examples",
            "Show, don't just tell",
            "Connect experiences to goals",
            "Research the university thoroughly",
            "End with a strong conclusion",
            "Keep it within word limits"
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-background neo-border">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Error Handling */}
      {error && (
        <div className="bg-destructive/10 border-4 border-destructive neo-border neo-shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-black uppercase tracking-wider text-destructive">
              Analysis Error
            </h2>
          </div>
          <p className="text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Hero Score Display */}
      {transformedResults && (
        <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={cn(
                  "w-32 h-32 neo-border-thick neo-shadow-xl flex items-center justify-center text-5xl font-black",
                  transformedResults.overallScore >= 80 ? "bg-secondary text-secondary-foreground" :
                  transformedResults.overallScore >= 60 ? "bg-primary text-primary-foreground" :
                  "bg-destructive text-destructive-foreground"
                )}>
                  {transformedResults.overallScore}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent neo-border neo-shadow rotate-12">
                  <Star className="w-6 h-6 text-accent-foreground m-1" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-4">
              SOP SCORE: {transformedResults.overallScore}/100
            </h2>

            <p className="text-xl font-bold uppercase tracking-wider text-muted-foreground">
              {transformedResults.overallScore >= 80 ? "EXCELLENT! READY FOR SUBMISSION" :
               transformedResults.overallScore >= 60 ? "GOOD! MINOR IMPROVEMENTS NEEDED" :
               "NEEDS WORK! SIGNIFICANT IMPROVEMENTS REQUIRED"}
            </p>
          </div>
        </div>
      )}

      {/* Modern Metrics Grid */}
      {transformedResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformedResults.insights.map((insight, index) => (
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
      )}

      {/* AI Analysis Feedback */}
      {transformedResults && (
        <div className="bg-card neo-border neo-shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary neo-border neo-shadow flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wider">
              AI ANALYSIS FEEDBACK
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-background neo-border neo-shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-secondary neo-border neo-shadow flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-secondary">
                  Strengths ({transformedResults.strengths.length})
                </h3>
              </div>
              <div className="space-y-3">
                {transformedResults.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary/10 neo-border border-secondary">
                    <div className="w-2 h-2 bg-secondary mt-2 neo-border flex-shrink-0"></div>
                    <p className="text-sm font-medium">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-background neo-border neo-shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-destructive neo-border neo-shadow flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-destructive">
                  Areas for Improvement ({transformedResults.weaknesses.length})
                </h3>
              </div>
              <div className="space-y-3">
                {transformedResults.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-destructive/10 neo-border border-destructive">
                    <div className="w-2 h-2 bg-destructive mt-2 neo-border flex-shrink-0"></div>
                    <p className="text-sm font-medium">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Enhancement Results */}
      {enhancementResults && (
        <div className="bg-card neo-border neo-shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent neo-border neo-shadow flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wider">
              AI ENHANCEMENT RESULTS
            </h2>
          </div>

          <div className="space-y-6">
            {enhancementResults.enhancement.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-background neo-border neo-shadow p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent neo-border neo-shadow flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Content Preview */}
      <div className="bg-card neo-border neo-shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary neo-border neo-shadow flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-wider">
            YOUR SOP CONTENT
          </h2>
        </div>

        <div className="bg-background neo-border neo-shadow p-6 max-h-64 overflow-y-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
            {sopData.content || "No content available"}
          </pre>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
            READY TO OPTIMIZE?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground neo-border neo-shadow-xl hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 font-black uppercase tracking-wider px-8 py-4 text-lg"
            >
              <Download className="w-6 h-6 mr-3" />
              DOWNLOAD ENHANCED SOP
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="neo-border neo-shadow-xl hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 font-black uppercase tracking-wider px-8 py-4 text-lg"
              onClick={() => setCurrentStep(2)}
            >
              <PenTool className="w-6 h-6 mr-3" />
              CONTINUE EDITING
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="neo-border neo-shadow-xl hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 font-black uppercase tracking-wider px-8 py-4 text-lg"
              onClick={() => setCurrentStep(1)}
            >
              <FileText className="w-6 h-6 mr-3" />
              START NEW SOP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-card neo-border neo-shadow-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent flex items-center justify-center neo-border">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-primary">
                SOP Optimizer
              </h1>
              <p className="text-muted-foreground font-bold uppercase tracking-wider">
                Create compelling statements of purpose
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 bg-accent neo-border transform -skew-x-12"></div>
            <div className="w-12 h-2 bg-primary neo-border transform skew-x-12"></div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-card neo-border neo-shadow p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: "Choose Template", icon: FileText },
              { step: 2, title: "Write SOP", icon: PenTool },
              { step: 3, title: "Analysis", icon: BarChart }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center neo-border font-black",
                  currentStep >= item.step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="ml-3">
                  <p className="font-bold uppercase tracking-wider text-sm">Step {item.step}</p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                </div>
                {index < 2 && (
                  <div className={cn(
                    "w-16 h-1 mx-4 neo-border",
                    currentStep > item.step ? "bg-primary" : "bg-muted"
                  )}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {(isAnalyzing || isEnhancing) ? (
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className={cn(
                "w-20 h-20 flex items-center justify-center neo-border mx-auto mb-6 animate-pulse",
                isEnhancing ? "bg-accent" : "bg-primary"
              )}>
                {isEnhancing ? (
                  <Sparkles className="w-10 h-10 text-accent-foreground" />
                ) : (
                  <BarChart className="w-10 h-10 text-primary-foreground" />
                )}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-4 neo-text-shadow-simple">
                {isEnhancing ? "ENHANCING YOUR SOP" : "ANALYZING YOUR SOP"}
              </h2>
              <p className="text-muted-foreground mb-6 font-medium">
                {isEnhancing
                  ? "Our AI is enhancing your statement with intelligent suggestions..."
                  : "Our AI is reviewing your statement for structure, content, and impact..."
                }
              </p>

              <div className="space-y-3">
                {isEnhancing ? [
                  "Analyzing content structure",
                  "Generating enhancement suggestions",
                  "Optimizing language and flow",
                  "Applying university-specific insights"
                ] : [
                  "Evaluating content quality",
                  "Analyzing structure and flow",
                  "Checking keyword optimization",
                  "Generating improvement feedback"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background neo-border">
                    <div className={cn(
                      "w-6 h-6 neo-border animate-spin",
                      isEnhancing ? "bg-accent" : "bg-primary"
                    )}></div>
                    <span className="font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}