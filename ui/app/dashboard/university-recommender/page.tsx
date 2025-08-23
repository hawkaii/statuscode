"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  MapPin,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Globe,
  Award,
  Search,
  Filter,
  Heart,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UniversityRecommenderPage() {
  const [showResults, setShowResults] = useState(false);
  const [profileData, setProfileData] = useState({
    cgpa: "",
    greScore: "",
    ieltsScore: "",
    field: "",
    location: "",
    budget: ""
  });

  const universities = [
    {
      name: "Stanford University",
      location: "California, USA",
      ranking: 2,
      acceptanceRate: 4.3,
      averageGPA: 3.9,
      tuitionFee: "$56,169",
      programs: ["Computer Science", "Engineering", "Business"],
      matchScore: 95,
      admissionChance: "High",
      scholarships: ["Merit-based", "Need-based"],
      highlights: ["Top CS Program", "Silicon Valley Location", "Research Opportunities"],
      image: "🏛️"
    },
    {
      name: "MIT",
      location: "Massachusetts, USA",
      ranking: 1,
      acceptanceRate: 6.7,
      averageGPA: 3.9,
      tuitionFee: "$53,818",
      programs: ["Engineering", "Computer Science", "Physics"],
      matchScore: 92,
      admissionChance: "High",
      scholarships: ["Merit-based", "Research Assistantship"],
      highlights: ["#1 Engineering", "Innovation Hub", "Startup Culture"],
      image: "🎓"
    },
    {
      name: "University of Toronto",
      location: "Ontario, Canada",
      ranking: 18,
      acceptanceRate: 43,
      averageGPA: 3.7,
      tuitionFee: "CAD $58,160",
      programs: ["Computer Science", "Engineering", "Business"],
      matchScore: 88,
      admissionChance: "Very High",
      scholarships: ["International Scholar", "Merit Award"],
      highlights: ["Diverse Community", "Strong Alumni", "Research Excellence"],
      image: "🍁"
    },
    {
      name: "ETH Zurich",
      location: "Zurich, Switzerland",
      ranking: 8,
      acceptanceRate: 8,
      averageGPA: 3.8,
      tuitionFee: "CHF 1,298",
      programs: ["Engineering", "Computer Science", "Applied Sciences"],
      matchScore: 85,
      admissionChance: "High",
      scholarships: ["Excellence Scholarship", "ESOP"],
      highlights: ["Low Tuition", "Research Focus", "Industry Connections"],
      image: "🏔️"
    }
  ];

  const handleSearch = () => {
    setShowResults(true);
  };

  const getChanceColor = (chance: string) => {
    switch (chance.toLowerCase()) {
      case "very high": return "text-secondary";
      case "high": return "text-primary";
      case "medium": return "text-accent";
      case "low": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-secondary";
    if (score >= 80) return "bg-primary";
    if (score >= 70) return "bg-accent";
    return "bg-destructive";
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
              <h1 className="text-3xl font-black uppercase tracking-wider neo-heading text-primary">
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

        {!showResults ? (
          /* Profile Input Form */
          <div className="bg-card neo-border neo-shadow p-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-center neo-text-shadow-black">
                Tell Us About Your Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA/GPA (out of 4.0)</Label>
                  <Input
                    id="cgpa"
                    placeholder="3.5"
                    value={profileData.cgpa}
                    onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gre">GRE Score (out of 340)</Label>
                  <Input
                    id="gre"
                    placeholder="320"
                    value={profileData.greScore}
                    onChange={(e) => setProfileData({ ...profileData, greScore: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ielts">IELTS Score (out of 9)</Label>
                  <Input
                    id="ielts"
                    placeholder="7.5"
                    value={profileData.ieltsScore}
                    onChange={(e) => setProfileData({ ...profileData, ieltsScore: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    placeholder="Computer Science"
                    value={profileData.field}
                    onChange={(e) => setProfileData({ ...profileData, field: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input
                    id="location"
                    placeholder="USA, Canada, Europe"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (Annual)</Label>
                  <Input
                    id="budget"
                    placeholder="$50,000"
                    value={profileData.budget}
                    onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full mt-8 h-14 text-lg font-bold uppercase tracking-wider"
              >
                <Search className="w-5 h-5 mr-2" />
                Find My Universities
              </Button>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background neo-border">
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Smart Matching</h3>
                  <p className="text-xs text-muted-foreground">AI-powered profile analysis</p>
                </div>
                <div className="text-center p-4 bg-background neo-border">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Admission Chances</h3>
                  <p className="text-xs text-muted-foreground">Real acceptance predictions</p>
                </div>
                <div className="text-center p-4 bg-background neo-border">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Scholarship Info</h3>
                  <p className="text-xs text-muted-foreground">Financial aid opportunities</p>
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
                <h2 className="text-2xl font-black uppercase tracking-wider neo-text-shadow-black">
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
                Found {universities.length} universities matching your profile. Sorted by match score.
              </p>
            </div>

            {/* University Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {universities.map((uni, index) => (
                <div key={index} className="bg-card neo-border neo-shadow p-6 hover:transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{uni.image}</div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-wider neo-text-shadow-black">
                          {uni.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {uni.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("w-16 h-16 flex items-center justify-center text-white font-black text-lg neo-border", getMatchScoreColor(uni.matchScore))}>
                        {uni.matchScore}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-bold uppercase">Match</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-sm font-bold uppercase tracking-wider">Ranking</span>
                      </div>
                      <p className="text-lg font-black">#{uni.ranking}</p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">Acceptance</span>
                      </div>
                      <p className="text-lg font-black">{uni.acceptanceRate}%</p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-bold uppercase tracking-wider">Avg GPA</span>
                      </div>
                      <p className="text-lg font-black">{uni.averageGPA}</p>
                    </div>
                    <div className="bg-background p-3 neo-border">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-bold uppercase tracking-wider">Tuition</span>
                      </div>
                      <p className="text-lg font-black">{uni.tuitionFee}</p>
                    </div>
                  </div>

                  {/* Admission Chance */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold uppercase tracking-wider text-sm">Admission Chance</span>
                      <span className={cn("font-black uppercase tracking-wider", getChanceColor(uni.admissionChance))}>
                        {uni.admissionChance}
                      </span>
                    </div>
                    <div className="w-full bg-muted neo-border h-2">
                      <div
                        className={cn("h-full neo-border-0", getMatchScoreColor(uni.matchScore))}
                        style={{ width: `${uni.matchScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="mb-4">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-2">Popular Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {uni.programs.map((program, programIndex) => (
                        <span key={programIndex} className="bg-accent/20 text-accent-foreground px-2 py-1 text-xs font-medium neo-border border-accent">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-2">Key Highlights</h4>
                    <ul className="space-y-1">
                      {uni.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary neo-border"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
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