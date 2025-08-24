"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Target,
  TrendingUp,
  Award,
  Search,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  BarChart3,
  Users,
  Globe,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UniversityAPI, type UniversityPredictionRequest, type UniversityPredictionResult } from "@/lib/api";

export default function UniversityRecommenderPage() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState(`{
  "researchExp": 3,
  "industryExp": 2,
  "toeflScore": 110.0,
  "gmatA": 4.5,
  "cgpa": 8.5,
  "gmatQ": 50.0,
  "cgpaScale": 10,
  "gmatV": 35.0,
  "gre_total": 315.0,
  "researchPubs": 8,
  "univName": "None"
}`);
  const [predictionResults, setPredictionResults] = useState<UniversityPredictionResult[]>([]);

  const handlePredict = async () => {
    if (!jsonInput.trim()) {
      setError("Please enter your profile data in JSON format");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting university prediction...");

      // Parse the JSON input
      let requestData: UniversityPredictionRequest;
      try {
        requestData = JSON.parse(jsonInput);
        console.log("Parsed request data:", requestData);
      } catch (parseError) {
        throw new Error("Invalid JSON format. Please check your input data.");
      }

      // Validate required fields
      const requiredFields = ['researchExp', 'industryExp', 'cgpa', 'cgpaScale'];
      const missingFields = requiredFields.filter(field => !(field in requestData));

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Call the API
      console.log("Making API request to university prediction service...");
      const results = await UniversityAPI.predictUniversities(requestData);
      console.log("Prediction results received:", results);

      if (!results || results.length === 0) {
        throw new Error("No prediction results received from the server");
      }

      // Sort by admission probability and take top 10
      const top10Results = results
        .sort((a, b) => b.p_admit - a.p_admit)
        .slice(0, 10);

      console.log("Top 10 results:", top10Results);
      setPredictionResults(top10Results);
      setShowResults(true);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err instanceof Error ? err.message : "Failed to get predictions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAdmissionColor = (probability: number) => {
    if (probability >= 0.8) return "text-secondary";
    if (probability >= 0.6) return "text-primary";
    if (probability >= 0.4) return "text-accent";
    return "text-destructive";
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return "bg-secondary";
    if (probability >= 0.6) return "bg-primary";
    if (probability >= 0.4) return "bg-accent";
    return "bg-destructive";
  };

  const formatProbability = (probability: number) => {
    return `${(probability * 100).toFixed(1)}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-card neo-border neo-shadow-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center neo-border">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-primary">
                University Recommender
              </h1>
              <p className="text-muted-foreground font-bold uppercase tracking-wider">
                Find your perfect university match
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 bg-primary neo-border transform -skew-x-12"></div>
            <div className="w-12 h-2 bg-secondary neo-border transform skew-x-12"></div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border-4 border-destructive neo-border neo-shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-destructive">
                Prediction Error
              </h2>
            </div>
            <p className="text-destructive font-medium">{error}</p>
            <Button
              onClick={() => setError(null)}
              className="mt-4 bg-destructive text-destructive-foreground neo-border neo-shadow"
            >
              Try Again
            </Button>
          </div>
        )}

        {!showResults ? (
          /* JSON Input Form */
          <div className="bg-card neo-border neo-shadow-xl p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-wider mb-4">
                  University Prediction
                </h2>
                <p className="text-muted-foreground font-medium">
                  Enter your academic profile data in JSON format to get university admission predictions
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* JSON Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary neo-border neo-shadow flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-wider">
                      Profile Data
                    </h3>
                  </div>

                  <div className="relative">
                    <textarea
                      className="w-full h-80 p-4 neo-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="Enter your profile data in JSON format..."
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                    />

                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background neo-border px-2 py-1">
                      JSON Format
                    </div>
                  </div>

                  <Button
                    onClick={handlePredict}
                    disabled={isLoading || !jsonInput.trim()}
                    className="w-full h-14 text-lg font-bold uppercase tracking-wider"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isLoading ? "Analyzing..." : "Predict My Universities"}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-secondary neo-border neo-shadow flex items-center justify-center">
                      <Zap className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-wider">
                      Features
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-background neo-border neo-shadow p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold uppercase tracking-wider text-sm mb-1">AI-Powered Predictions</h4>
                          <p className="text-xs text-muted-foreground">Machine learning algorithms analyze your profile</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background neo-border neo-shadow p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold uppercase tracking-wider text-sm mb-1">Top 10 Universities</h4>
                          <p className="text-xs text-muted-foreground">Sorted by admission probability</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background neo-border neo-shadow p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold uppercase tracking-wider text-sm mb-1">Real Probability Scores</h4>
                          <p className="text-xs text-muted-foreground">Data-driven admission chances</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background neo-border neo-shadow p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold uppercase tracking-wider text-sm mb-1">Comprehensive Analysis</h4>
                          <p className="text-xs text-muted-foreground">Multiple factors considered</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Data Info */}
                  <div className="bg-muted neo-border neo-shadow p-4">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-3 text-muted-foreground">
                      Field Explanations:
                    </h4>
                    <div className="text-xs text-muted-foreground space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-bold text-primary">• researchExp:</p>
                          <p>Years of research experience</p>
                        </div>
                        <div>
                          <p className="font-bold text-primary">• industryExp:</p>
                          <p>Years of industry experience</p>
                        </div>
                        <div>
                          <p className="font-bold text-secondary">• toeflScore:</p>
                          <p>TOEFL/IELTS score (0-120)</p>
                        </div>
                        <div>
                          <p className="font-bold text-secondary">• cgpa:</p>
                          <p>Current GPA/CGPA score</p>
                        </div>
                        <div>
                          <p className="font-bold text-accent">• gre_total:</p>
                          <p>Total GRE score (260-340)</p>
                        </div>
                        <div>
                          <p className="font-bold text-accent">• researchPubs:</p>
                          <p>Number of research publications</p>
                        </div>
                        <div>
                          <p className="font-bold text-destructive">• gmatA, gmatQ, gmatV:</p>
                          <p>GMAT section scores</p>
                        </div>
                        <div>
                          <p className="font-bold text-destructive">• cgpaScale:</p>
                          <p>GPA scale (usually 4.0 or 10.0)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-card neo-border neo-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase tracking-wider">
                  Your University Matches
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                    <Search className="w-4 h-4 mr-2" />
                    New Search
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground font-medium">
                Found {predictionResults.length} universities ranked by AI admission probability prediction.
              </p>
            </div>

            {/* University Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {predictionResults.map((result, index) => (
                <div key={index} className="bg-card neo-border neo-shadow p-6 hover:transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🏛️</div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-wider">
                          {result.univName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          University
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("w-16 h-16 flex items-center justify-center text-white font-black text-lg neo-border", getProbabilityColor(result.p_admit))}>
                        {formatProbability(result.p_admit)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-bold uppercase">Probability</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-sm font-bold uppercase tracking-wider">Rank</span>
                      </div>
                      <p className="text-lg font-black">#{index + 1}</p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">Score</span>
                      </div>
                      <p className="text-lg font-black">{(result.p_admit * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-bold uppercase tracking-wider">Category</span>
                      </div>
                      <p className="text-lg font-black">
                        {result.p_admit >= 0.8 ? "EXCELLENT" :
                         result.p_admit >= 0.6 ? "GOOD" :
                         result.p_admit >= 0.4 ? "FAIR" :
                         "LOW"}
                      </p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-bold uppercase tracking-wider">Chance</span>
                      </div>
                      <p className={cn("text-lg font-black", getAdmissionColor(result.p_admit))}>
                        {result.p_admit >= 0.8 ? "HIGH" :
                         result.p_admit >= 0.6 ? "MEDIUM" :
                         result.p_admit >= 0.4 ? "LOW" :
                         "VERY LOW"}
                      </p>
                    </div>
                  </div>

                  {/* Admission Probability */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold uppercase tracking-wider text-sm">Admission Probability</span>
                      <span className={cn("font-black uppercase tracking-wider text-sm", getAdmissionColor(result.p_admit))}>
                        {formatProbability(result.p_admit)}
                      </span>
                    </div>
                    <div className="w-full bg-muted neo-border h-2">
                      <div
                        className={cn("h-full neo-border-0", getProbabilityColor(result.p_admit))}
                        style={{ width: `${result.p_admit * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* University Info */}
                  <div className="mb-4">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-2">University Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background p-2 neo-border text-center">
                        <div className="text-xs text-muted-foreground font-bold uppercase">AI Score</div>
                        <div className={cn("text-sm font-black", getAdmissionColor(result.p_admit))}>
                          {(result.p_admit * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-background p-2 neo-border text-center">
                        <div className="text-xs text-muted-foreground font-bold uppercase">Rank</div>
                        <div className="text-sm font-black text-primary">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mb-4">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-2">AI Recommendation</h4>
                    <div className={cn("p-3 neo-border text-center font-black uppercase text-sm",
                      result.p_admit >= 0.8 ? "bg-secondary/20 text-secondary border-secondary" :
                      result.p_admit >= 0.6 ? "bg-primary/20 text-primary border-primary" :
                      result.p_admit >= 0.4 ? "bg-accent/20 text-accent border-accent" :
                      "bg-destructive/20 text-destructive border-destructive"
                    )}>
                      {result.p_admit >= 0.8 ? "HIGHLY RECOMMENDED - STRONG CANDIDATE" :
                       result.p_admit >= 0.6 ? "RECOMMENDED - GOOD FIT" :
                       result.p_admit >= 0.4 ? "CONSIDER WITH CAUTION" :
                       "NOT RECOMMENDED - LOW CHANCE"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 font-bold uppercase tracking-wider text-sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1 font-bold uppercase tracking-wider text-sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="font-bold uppercase tracking-wider">
                Load More Universities
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}