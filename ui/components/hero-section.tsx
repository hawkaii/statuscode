"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Target, Brain } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { GridBackground } from "@/components/ui/grid-background"
import { useProtectedNavigation } from "@/lib/hooks/use-protected-navigation"

export function HeroSection() {
  const { handleProtectedNavigation } = useProtectedNavigation()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16 sm:pt-20">
      {/* Advanced Grid Background - As overlay */}
      <div className="absolute inset-0 z-0">
        <GridBackground
          className="w-full h-full"
          gridSize={50}
          gridColor="rgba(0, 0, 0, 0.15)"
          darkGridColor="rgba(255, 255, 255, 0.15)"
          showFade={true}
          fadeIntensity={25}
        />
      </div>

      {/* Background geometric elements - redistributed to both sides */}
      <div className="absolute inset-0 z-10">
        {/* Left side elements */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-12 sm:w-16 md:w-24 lg:w-32 h-12 sm:h-16 md:h-24 lg:h-32 bg-secondary neo-border neo-shadow rotate-12 neo-animate-pulse" />
        <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-20 w-10 sm:w-14 md:w-20 lg:w-28 h-10 sm:h-14 md:h-20 lg:h-28 bg-accent neo-border neo-shadow rotate-45 neo-animate-shake" />

        {/* Right side elements */}
        <div className="absolute top-32 sm:top-40 right-16 sm:right-20 md:right-32 w-8 sm:w-12 md:w-16 lg:w-24 h-8 sm:h-12 md:h-16 lg:h-24 bg-primary neo-border neo-shadow -rotate-12 neo-animate-bounce" />
        <div className="absolute bottom-16 sm:bottom-20 right-8 sm:right-10 w-10 sm:w-14 md:w-20 lg:w-28 h-10 sm:h-14 md:h-20 lg:h-28 bg-secondary neo-border neo-shadow -rotate-45" />
      </div>

      {/* Floating text elements - redistributed to both sides */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Left side floating text */}
        <div className="hidden md:block absolute top-24 lg:top-32 left-20 lg:left-32 text-primary font-black text-base sm:text-lg lg:text-2xl uppercase neo-text-shadow-gray -neo-rotate opacity-80">
          SMART AI
        </div>
        <div className="hidden xl:block absolute top-1/2 left-8 text-accent font-black text-sm lg:text-lg uppercase neo-text-shadow -rotate-90 opacity-60">
          PREDICT
        </div>

        {/* Right side floating text */}
        <div className="hidden md:block absolute top-20 lg:top-28 right-20 lg:right-32 text-secondary font-black text-base sm:text-lg lg:text-2xl uppercase neo-text-shadow-gray neo-rotate opacity-80">
          AI POWERED
        </div>
        <div className="hidden md:block absolute bottom-24 lg:bottom-32 right-20 lg:right-32 text-accent font-black text-sm sm:text-base lg:text-xl uppercase neo-text-shadow -neo-rotate opacity-80">
          UNI RECOMMENDATION
        </div>
        <div className="hidden xl:block absolute top-1/3 right-4 text-primary font-black text-sm lg:text-lg uppercase neo-text-shadow-gray -rotate-90 opacity-60">
          FUTURE
        </div>
      </div>

      {/* Main content container with centered text */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GIF Animation - positioned over the letter C in COMPANION */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-75 -translate-y-124 z-30 mt-2 sm:mt-4 lg:mt-6 -ml-12 sm:-ml-16 lg:-ml-20">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transform rotate-335">
            <DotLottieReact
              src="https://lottie.host/a4dc1e48-62f1-42e0-b8a9-e1d7a9a24138/1evHCwUHuK.lottie"
              loop
              autoplay
              className="w-full h-full"
              style={{
                animation: 'float 3s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        {/* Centered text content */}
        <div className="text-center relative z-25">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-5 bg-accent text-foreground neo-border neo-shadow font-black uppercase text-xs sm:text-base lg:text-lg xl:text-xl tracking-wide neo-skew">
              <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
              <span className="hidden sm:inline">AI-POWERED UNIVERSITY ADMISSIONS</span>
              <span className="sm:hidden text-xs">AI ADMISSIONS</span>
            </div>

            {/* Main heading - Restored with proper text shadows */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none uppercase tracking-tight">
              <span className="text-primary neo-text-shadow block transform -rotate-1">YOUR AI</span>
              <span className="text-secondary neo-text-shadow block transform rotate-1 my-1 sm:my-3 lg:my-5">COMPANION</span>
              <span className="text-foreground neo-text-shadow-black block">FOR UNIVERSITY</span>
              <span className="text-accent neo-text-shadow block transform -rotate-1 mt-1 sm:mt-3 lg:mt-5">ADMISSIONS</span>
            </h1>

            {/* Description - Fixed text visibility */}
            <div className="bg-foreground text-background neo-border neo-shadow-lg p-3 sm:p-5 lg:p-7 xl:p-10 max-w-5xl mx-auto neo-skew relative z-10">
              <p className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold leading-tight uppercase tracking-wide">
                APPLYING TO FOREIGN UNIVERSITIES IS OVERWHELMING. ACADEMIA AI SUITE SIMPLIFIES THE JOURNEY BY PREDICTING YOUR CHANCES, OPTIMIZING YOUR RESUME, AND CRAFTING A COMPELLING STATEMENT OF PURPOSE — ALL IN ONE PLACE.
              </p>
            </div>

            {/* Action buttons - Restored */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-7 justify-center items-center pt-5 sm:pt-7 lg:pt-10">
              <Button
                onClick={() => handleProtectedNavigation("features")}
                className="w-full sm:w-auto bg-primary text-primary-foreground neo-border neo-shadow-xl neo-hover font-black uppercase text-base sm:text-lg lg:text-xl xl:text-2xl px-5 sm:px-7 lg:px-10 xl:px-14 py-3 sm:py-5 lg:py-7 xl:py-9 tracking-wide cursor-pointer"
              >
                GET STARTED
                <ArrowRight className="ml-2 sm:ml-3 lg:ml-5 w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-11 xl:h-11" />
              </Button>
              <Button
                onClick={() => handleProtectedNavigation("features")}
                className="w-full sm:w-auto bg-secondary text-secondary-foreground neo-border neo-shadow-xl neo-hover font-black uppercase text-base sm:text-lg lg:text-xl xl:text-2xl px-5 sm:px-7 lg:px-10 xl:px-14 py-3 sm:py-5 lg:py-7 xl:py-9 tracking-wide cursor-pointer"
              >
                LEARN MORE
                <Target className="ml-2 sm:ml-3 lg:ml-5 w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-11 xl:h-11" />
              </Button>
            </div>

            {/* Feature icons - Restored */}
            <div className="flex justify-center gap-3 sm:gap-5 lg:gap-7 xl:gap-10 pt-7 sm:pt-10 lg:pt-14">
              <div className="bg-accent text-foreground neo-border neo-shadow p-2 sm:p-3 lg:p-5 xl:p-7 neo-rotate neo-animate-bounce">
                <Brain className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
              </div>
              <div className="bg-primary text-primary-foreground neo-border neo-shadow p-2 sm:p-3 lg:p-5 xl:p-7 -neo-rotate neo-animate-pulse">
                <Zap className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
              </div>
              <div className="bg-secondary text-secondary-foreground neo-border neo-shadow p-2 sm:p-3 lg:p-5 xl:p-7 neo-rotate neo-animate-shake">
                <Target className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
