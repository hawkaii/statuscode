"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Target, Brain } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 bg-primary neo-border neo-shadow rotate-12 neo-animate-bounce" />
        <div className="absolute top-40 right-4 sm:right-20 w-12 sm:w-24 h-12 sm:h-24 bg-secondary neo-border neo-shadow -rotate-12 neo-animate-pulse" />
        <div className="absolute bottom-40 left-4 sm:left-20 w-20 sm:w-40 h-20 sm:h-40 bg-accent neo-border neo-shadow rotate-45 neo-animate-shake" />
        <div className="absolute bottom-20 right-4 sm:right-10 w-14 sm:w-28 h-14 sm:h-28 bg-primary neo-border neo-shadow -rotate-45" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-32 right-32 text-primary font-black text-lg sm:text-2xl uppercase neo-text-shadow neo-rotate opacity-80">
          AI POWERED
        </div>
        <div className="hidden sm:block absolute bottom-32 left-32 text-secondary font-black text-base sm:text-xl uppercase neo-text-shadow -neo-rotate opacity-80">
          UNI RECOMMENDATION
        </div>
        <div className="hidden lg:block absolute top-1/2 left-10 text-accent font-black text-sm sm:text-lg uppercase neo-text-shadow rotate-90 opacity-60">
          SMART
        </div>
        <div className="hidden lg:block absolute top-1/3 right-10 text-primary font-black text-sm sm:text-lg uppercase neo-text-shadow -rotate-90 opacity-60">
          FUTURE
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 sm:space-y-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-accent text-foreground neo-border neo-shadow font-black uppercase text-sm sm:text-lg tracking-wide neo-skew">
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">AI-POWERED UNIVERSITY ADMISSIONS</span>
            <span className="sm:hidden">AI ADMISSIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-none uppercase tracking-tight">
            <span className="text-primary neo-text-shadow block transform -rotate-1">YOUR AI</span>
            <span className="text-secondary neo-text-shadow block transform rotate-1 my-2 sm:my-4">COMPANION</span>
            <span className="text-foreground neo-text-shadow-black block">FOR UNIVERSITY</span>
            <span className="text-accent neo-text-shadow block transform -rotate-1 mt-2 sm:mt-4">ADMISSIONS</span>
          </h1>

          <div className="bg-foreground text-background neo-border neo-shadow-lg p-4 sm:p-8 max-w-5xl mx-auto neo-skew">
            <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight uppercase tracking-wide">
              APPLYING TO FOREIGN UNIVERSITIES IS OVERWHELMING. UNICOMPASS AI SUITE SIMPLIFIES THE JOURNEY BY PREDICTING
              YOUR CHANCES, OPTIMIZING YOUR RESUME, AND CRAFTING A COMPELLING STATEMENT OF PURPOSE — ALL IN ONE PLACE.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-8">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground neo-border neo-shadow-xl neo-hover font-black uppercase text-lg sm:text-2xl px-8 sm:px-12 py-6 sm:py-8 tracking-wide">
              GET STARTED
              <ArrowRight className="ml-2 sm:ml-4 w-6 h-6 sm:w-8 sm:h-8" />
            </Button>
            <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground neo-border neo-shadow-xl neo-hover font-black uppercase text-lg sm:text-2xl px-8 sm:px-12 py-6 sm:py-8 tracking-wide">
              LEARN MORE
              <Target className="ml-2 sm:ml-4 w-6 h-6 sm:w-8 sm:h-8" />
            </Button>
          </div>

          <div className="flex justify-center gap-4 sm:gap-8 pt-8 sm:pt-12">
            <div className="bg-accent text-foreground neo-border neo-shadow p-3 sm:p-6 neo-rotate neo-animate-bounce">
              <Brain className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <div className="bg-primary text-primary-foreground neo-border neo-shadow p-3 sm:p-6 -neo-rotate neo-animate-pulse">
              <Zap className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <div className="bg-secondary text-secondary-foreground neo-border neo-shadow p-3 sm:p-6 neo-rotate neo-animate-shake">
              <Target className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
