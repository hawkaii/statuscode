"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  FileText,
  GraduationCap,
  BookOpen,
  BarChart3,
  Upload,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const quickStats = [
    {
      icon: FileText,
      label: "Resume Score",
      value: "85/100",
      description: "Good progress",
      color: "bg-secondary",
      textColor: "text-secondary-foreground"
    },
    {
      icon: GraduationCap,
      label: "Universities Matched",
      value: "12",
      description: "Perfect fits found",
      color: "bg-primary",
      textColor: "text-primary-foreground"
    },
    {
      icon: BookOpen,
      label: "SOPs Created",
      value: "3",
      description: "Ready to submit",
      color: "bg-accent",
      textColor: "text-accent-foreground"
    },
    {
      icon: BarChart3,
      label: "Applications",
      value: "8",
      description: "In progress",
      color: "bg-destructive",
      textColor: "text-destructive-foreground"
    }
  ];

  const actionCards = [
    {
      icon: FileText,
      title: "Resume Analyzer",
      description: "Upload and analyze your resume for higher studies optimization",
      features: ["CGPA & GPA analysis", "Experience evaluation", "Skills assessment", "ATS optimization"],
      action: "Analyze Resume",
      href: "/dashboard/resume-analyzer",
      color: "hover:bg-secondary",
      iconBg: "bg-secondary"
    },
    {
      icon: GraduationCap,
      title: "University Recommender",
      description: "Get personalized university recommendations based on your profile",
      features: ["Profile matching", "Admission chances", "Scholarship info", "Location preferences"],
      action: "Find Universities",
      href: "/dashboard/university-recommender",
      color: "hover:bg-primary hover:text-primary-foreground",
      iconBg: "bg-primary"
    },
    {
      icon: BookOpen,
      title: "SOP Optimizer",
      description: "Create compelling Statement of Purpose with AI assistance",
      features: ["Template library", "AI suggestions", "Grammar check", "University-specific tips"],
      action: "Create SOP",
      href: "/dashboard/sop-optimizer",
      color: "hover:bg-accent",
      iconBg: "bg-accent"
    },
    {
      icon: BarChart3,
      title: "Application Tracker",
      description: "Track your university applications and deadlines",
      features: ["Deadline tracking", "Status updates", "Document checklist", "Progress monitoring"],
      action: "Track Applications",
      href: "/dashboard/application-tracker",
      color: "hover:bg-destructive hover:text-destructive-foreground",
      iconBg: "bg-destructive"
    }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      text: "Resume uploaded and analyzed",
      time: "2 hours ago",
      color: "text-secondary"
    },
    {
      icon: Target,
      text: "5 new university matches found",
      time: "1 day ago",
      color: "text-primary"
    },
    {
      icon: Clock,
      text: "SOP draft saved",
      time: "3 days ago",
      color: "text-accent"
    },
    {
      icon: AlertCircle,
      text: "Application deadline approaching",
      time: "5 days ago",
      color: "text-destructive"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-card neo-border neo-shadow-xl p-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-primary mb-4">
            Welcome Back, {user?.displayName?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-lg text-muted-foreground font-bold uppercase tracking-wider">
            Your journey to higher studies starts here
          </p>
          <div className="flex justify-center md:justify-start gap-2 mt-4">
            <div className="w-16 h-2 bg-primary neo-border transform -skew-x-12"></div>
            <div className="w-12 h-2 bg-secondary neo-border transform skew-x-12"></div>
            <div className="w-16 h-2 bg-accent neo-border transform -skew-x-12"></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-card neo-border neo-shadow p-6 text-center">
            <div className={cn("w-12 h-12 mx-auto mb-4 flex items-center justify-center neo-border", stat.color)}>
              <stat.icon className={cn("w-6 h-6", stat.textColor)} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-2">
              {stat.value}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {actionCards.map((card, index) => (
          <div
            key={index}
            className={cn(
              "bg-card neo-border neo-shadow p-6 transition-all duration-200 cursor-pointer",
              "hover:transform hover:translate-x-2 hover:translate-y-2",
              card.color
            )}
            onClick={() => router.push(card.href)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={cn("w-12 h-12 flex items-center justify-center neo-border", card.iconBg)}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase tracking-wider mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                Features:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {card.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary neo-border"></div>
                    <span className="text-xs font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 mr-2" />
              {card.action}
            </Button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card neo-border neo-shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-black uppercase tracking-wider">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-background neo-border">
              <activity.icon className={cn("w-5 h-5", activity.color)} />
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="font-bold uppercase tracking-wider">
            View All Activity
          </Button>
        </div>
      </div>
    </div>
  );
}