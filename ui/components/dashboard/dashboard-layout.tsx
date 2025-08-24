"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  GraduationCap,
  BookOpen,
  BarChart3,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const navigationItems = [
    {
      icon: Home,
      label: "Overview",
      href: "/dashboard",
      color: "hover:bg-accent",
      description: "Dashboard home"
    },
    {
      icon: FileText,
      label: "Resume Analyzer",
      href: "/dashboard/resume-analyzer",
      color: "hover:bg-secondary",
      description: "Analyze & optimize your resume"
    },
    {
      icon: GraduationCap,
      label: "University Recommender",
      href: "/dashboard/university-recommender",
      color: "hover:bg-primary hover:text-primary-foreground",
      description: "Find your perfect university match"
    },
    {
      icon: BookOpen,
      label: "SOP Optimizer",
      href: "/dashboard/sop-optimizer",
      color: "hover:bg-accent",
      description: "Craft compelling SOPs"
    },
    {
      icon: BarChart3,
      label: "Application Tracker",
      href: "/dashboard/application-tracker",
      color: "hover:bg-secondary",
      description: "Track your applications"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card neo-border-thick neo-shadow sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4 max-w-full">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              variant="ghost2"
              size="icon"
              className="md:hidden neo-border bg-background flex-shrink-0"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="ghost2"
              className="flex items-center gap-1 sm:gap-2 neo-border bg-background hover:bg-accent min-w-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-bold uppercase tracking-wider text-xs sm:text-sm truncate">Back to Home</span>
            </Button>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wider text-primary text-center flex-1 min-w-0 truncate px-2">
            AcademiaAI Dashboard
          </h1>

          <div className="w-8 sm:w-12 md:w-20 flex-shrink-0"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 sm:w-72 md:w-80 bg-card neo-border-thick neo-shadow transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ top: "88px" }} // Account for header height
        >
          {/* Mobile close button */}
          <div className="md:hidden p-4 border-b-4 border-border">
            <Button
              onClick={() => setIsSidebarOpen(false)}
              variant="ghost2"
              size="icon"
              className="neo-border bg-background hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-5 h-5 text-black" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase tracking-wider text-muted-foreground mb-4">
                Navigation
              </h2>
              <div className="w-16 h-1 bg-primary neo-shadow"></div>
            </div>

            {navigationItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant="ghost2"
                  className={cn(
                    "w-full justify-start h-16 text-left neo-border mb-3 bg-background p-4",
                    "hover:transform hover:translate-x-2 transition-all duration-200",
                    item.color
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-8 h-8 flex items-center justify-center bg-muted neo-border">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold uppercase tracking-wider text-sm truncate">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t-4 border-border bg-muted">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Powered by AI
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-primary neo-border"></div>
                <div className="w-2 h-2 bg-secondary neo-border"></div>
                <div className="w-2 h-2 bg-accent neo-border"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 w-full">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}