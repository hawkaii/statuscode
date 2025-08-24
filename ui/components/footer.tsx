import { Github, Linkedin, Zap, Target, Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Background decorative elements - responsive sizes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary neo-border rotate-45"></div>
        <div className="absolute top-8 sm:top-20 right-8 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-secondary neo-border -rotate-45"></div>
        <div className="absolute bottom-4 sm:bottom-10 left-1/4 w-14 h-14 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-accent neo-border rotate-12"></div>
        <div className="absolute bottom-8 sm:bottom-20 right-1/3 w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 bg-primary neo-border -rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* About section */}
          <div className="bg-primary text-primary-foreground neo-border-thick neo-shadow-lg p-4 sm:p-6 lg:p-8 neo-rotate">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 sm:mb-6 neo-text-shadow">ABOUT</h3>
            <div className="bg-background text-foreground neo-border p-3 sm:p-4 neo-skew">
              <p className="font-bold uppercase text-xs sm:text-sm leading-tight">
                ACADEMIA AI SUITE IS YOUR AI-POWERED ADMISSIONS COUNSELOR, DESIGNED TO SIMPLIFY THE APPLICATION
                PROCESS WITH SMART PREDICTIONS, RESUME ANALYSIS, AND SOP GUIDANCE.
              </p>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="bg-primary text-primary-foreground neo-border-thick neo-shadow-lg p-4 sm:p-6 lg:p-8 -neo-rotate">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 sm:mb-6 neo-text-shadow">QUICK LINKS</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href="#features"
                  className="block bg-background text-foreground neo-border p-2 sm:p-3 neo-hover font-bold uppercase text-xs sm:text-sm tracking-wide"
                >
                  FEATURES
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="block bg-background text-foreground neo-border p-2 sm:p-3 neo-hover font-bold uppercase text-xs sm:text-sm tracking-wide"
                >
                  ROADMAP
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block bg-background text-foreground neo-border p-2 sm:p-3 neo-hover font-bold uppercase text-xs sm:text-sm tracking-wide"
                >
                  GITHUB REPO
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links section */}
          <div className="bg-primary text-primary-foreground neo-border-thick neo-shadow-lg p-4 sm:p-6 lg:p-8 neo-rotate md:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 sm:mb-6 neo-text-shadow">SOCIAL LINKS</h3>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="bg-background text-foreground neo-border neo-shadow p-3 sm:p-4 neo-hover"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
              <a
                href="#"
                className="bg-background text-foreground neo-border neo-shadow p-3 sm:p-4 neo-hover"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="bg-primary neo-border p-2 sm:p-3 neo-animate-bounce">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              </div>
              <div className="bg-secondary neo-border p-2 sm:p-3 neo-animate-pulse">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary-foreground" />
              </div>
              <div className="bg-background neo-border p-2 sm:p-3 neo-animate-shake">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8">
          <div className="bg-background text-foreground neo-border-thick neo-shadow-xl p-4 sm:p-6 text-center neo-skew">
            <p className="font-black uppercase text-sm sm:text-base lg:text-lg tracking-wide">
              © 2025 ACADEMIA AI SUITE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
