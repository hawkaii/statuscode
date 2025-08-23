"use client"

import { Quote, Zap, Target, Brain } from "lucide-react"

export function VisionSection() {
  return (
    <section className="py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-primary text-primary-foreground neo-border-thick neo-shadow-xl p-8 neo-skew mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight neo-text-shadow">
              OUR VISION
            </h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-12 neo-rotate mb-12">
            <div className="relative">
              <div className="absolute -top-8 -left-8 bg-accent neo-border neo-shadow p-4">
                <Quote className="w-16 h-16 text-foreground" />
              </div>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl leading-tight font-black uppercase tracking-wide pt-8">
                "APPLYING TO FOREIGN UNIVERSITIES IS A FRAGMENTED AND STRESSFUL PROCESS. UNICOMPASS AI SUITE IS HERE TO
                CHANGE THAT. BY UNITING MULTIPLE SPECIALIZED AI AGENTS, WE PROVIDE STUDENTS WITH A CENTRALIZED,
                INTELLIGENT, AND EASY-TO-USE ADMISSIONS ASSISTANT."
              </blockquote>
            </div>
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-primary text-primary-foreground neo-border neo-shadow-lg p-6 neo-rotate neo-animate-bounce">
              <Brain className="w-12 h-12" />
              <div className="text-lg font-black uppercase mt-2">SMART</div>
            </div>
            <div className="bg-secondary text-secondary-foreground neo-border neo-shadow-lg p-6 -neo-rotate neo-animate-pulse">
              <Zap className="w-12 h-12" />
              <div className="text-lg font-black uppercase mt-2">FAST</div>
            </div>
            <div className="bg-accent text-accent-foreground neo-border neo-shadow-lg p-6 neo-rotate neo-animate-shake">
              <Target className="w-12 h-12" />
              <div className="text-lg font-black uppercase mt-2">PRECISE</div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-20 w-32 h-32 bg-primary neo-border rotate-45 opacity-20"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary neo-border -rotate-45 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
