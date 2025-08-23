import { Github, Linkedin, Zap, Target, Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary neo-border rotate-45"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-secondary neo-border -rotate-45"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-accent neo-border rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-primary neo-border -rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-primary text-primary-foreground neo-border-thick neo-shadow-lg p-8 neo-rotate">
            <h3 className="text-2xl font-black uppercase mb-6 neo-text-shadow">ABOUT</h3>
            <div className="bg-background text-foreground neo-border p-4 neo-skew">
              <p className="font-bold uppercase text-sm leading-tight">
                UNICOMPASS AI SUITE IS YOUR AI-POWERED ADMISSIONS COUNSELOR, DESIGNED TO SIMPLIFY THE APPLICATION
                PROCESS WITH SMART PREDICTIONS, RESUME ANALYSIS, AND SOP GUIDANCE.
              </p>
            </div>
          </div>

          <div className="bg-secondary text-secondary-foreground neo-border-thick neo-shadow-lg p-8 -neo-rotate">
            <h3 className="text-2xl font-black uppercase mb-6 neo-text-shadow">QUICK LINKS</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="block bg-background text-foreground neo-border p-3 neo-hover font-bold uppercase text-sm tracking-wide"
                >
                  FEATURES
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="block bg-background text-foreground neo-border p-3 neo-hover font-bold uppercase text-sm tracking-wide"
                >
                  ROADMAP
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block bg-background text-foreground neo-border p-3 neo-hover font-bold uppercase text-sm tracking-wide"
                >
                  GITHUB REPO
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-accent text-accent-foreground neo-border-thick neo-shadow-lg p-8 neo-rotate">
            <h3 className="text-2xl font-black uppercase mb-6 neo-text-shadow">SOCIAL LINKS</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-background text-foreground neo-border neo-shadow p-4 neo-hover"
                aria-label="GitHub"
              >
                <Github className="w-8 h-8" />
              </a>
              <a
                href="#"
                className="bg-background text-foreground neo-border neo-shadow p-4 neo-hover"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-8 h-8" />
              </a>
            </div>

            <div className="flex gap-3 mt-6">
              <div className="bg-primary neo-border p-3 neo-animate-bounce">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="bg-secondary neo-border p-3 neo-animate-pulse">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="bg-background neo-border p-3 neo-animate-shake">
                <Target className="w-6 h-6 text-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8">
          <div className="bg-background text-foreground neo-border-thick neo-shadow-xl p-6 text-center neo-skew">
            <p className="font-black uppercase text-lg tracking-wide">
              © 2025 UNICOMPASS AI SUITE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
