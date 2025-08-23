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
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SOPOptimizerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sopData, setSopData] = useState({
    university: "",
    program: "",
    content: "",
    selectedTemplate: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const analysisResults = {
    overallScore: 82,
    wordCount: 847,
    readabilityScore: 78,
    sections: [
      {
        title: "Introduction",
        score: 85,
        feedback: "Strong opening that captures attention",
        suggestions: ["Add more specific details about your motivation"]
      },
      {
        title: "Academic Background",
        score: 90,
        feedback: "Well-structured academic narrative",
        suggestions: ["Quantify achievements where possible"]
      },
      {
        title: "Professional Experience",
        score: 75,
        feedback: "Good examples but could be more impactful",
        suggestions: ["Focus on leadership and results", "Add specific metrics"]
      },
      {
        title: "Goals & Vision",
        score: 80,
        feedback: "Clear goals but could be more specific",
        suggestions: ["Connect goals to university's strengths", "Be more specific about timeline"]
      },
      {
        title: "Conclusion",
        score: 78,
        feedback: "Decent conclusion but could be stronger",
        suggestions: ["End with a memorable statement", "Reiterate key themes"]
      }
    ]
  };

  const handleTemplateSelect = (templateId: string) => {
    setSopData({ ...sopData, selectedTemplate: templateId });
    setCurrentStep(2);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(3);
    }, 2000);
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
        <h2 className="text-2xl font-black uppercase tracking-wider mb-4 neo-text-shadow-black">
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
        <h2 className="text-2xl font-black uppercase tracking-wider mb-4 neo-text-shadow-black">
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
          <h2 className="text-2xl font-black uppercase tracking-wider neo-text-shadow-black">
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

        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleAnalyze}
            disabled={!sopData.content.trim()}
            className="font-bold uppercase tracking-wider"
          >
            <BarChart className="w-4 h-4 mr-2" />
            Analyze SOP
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
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-card neo-border neo-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black uppercase tracking-wider neo-text-shadow-black">
            SOP Analysis Results
          </h2>
          <div className="text-right">
            <div className={cn("text-4xl font-black", getScoreColor(analysisResults.overallScore))}>
              {analysisResults.overallScore}/100
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Overall Score
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-background neo-border">
            <div className="text-2xl font-black text-primary mb-2">{analysisResults.wordCount}</div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Words</p>
          </div>
          <div className="text-center p-4 bg-background neo-border">
            <div className="text-2xl font-black text-secondary mb-2">{analysisResults.readabilityScore}</div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Readability</p>
          </div>
          <div className="text-center p-4 bg-background neo-border">
            <div className="text-2xl font-black text-accent mb-2">A-</div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Grade</p>
          </div>
        </div>

        <div className="w-full bg-muted neo-border h-4 mb-4">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase tracking-wider">{section.title}</h3>
              <div className={cn("text-xl font-black", getScoreColor(section.score))}>
                {section.score}/100
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="font-bold uppercase tracking-wider text-sm">Feedback</span>
              </div>
              <p className="text-sm bg-secondary/10 p-3 neo-border border-secondary">
                {section.feedback}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <span className="font-bold uppercase tracking-wider text-sm">Suggestions</span>
              </div>
              <ul className="space-y-2">
                {section.suggestions.map((suggestion, suggestionIndex) => (
                  <li key={suggestionIndex} className="text-sm bg-accent/10 p-2 neo-border border-accent flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent mt-2 neo-border flex-shrink-0"></div>
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
            <Download className="w-4 h-4 mr-2" />
            Download Final SOP
          </Button>
          <Button variant="outline" className="flex-1 font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4 mr-2" />
            Continue Editing
          </Button>
          <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 font-bold uppercase tracking-wider">
            Start New SOP
          </Button>
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
              <h1 className="text-3xl font-black uppercase tracking-wider neo-heading text-primary">
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
        {isAnalyzing ? (
          <div className="bg-card neo-border neo-shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary flex items-center justify-center neo-border mx-auto mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-4 neo-text-shadow-black">
                Analyzing Your SOP
              </h2>
              <p className="text-muted-foreground mb-6 font-medium">
                Our AI is reviewing your statement for structure, content, and impact...
              </p>
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