"use client"

import { useState, useEffect } from "react"
import { Quote, Zap, Target, Brain } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function VisionSection() {
  const [currentGif, setCurrentGif] = useState(0)

  // Array of GIF URLs
  const gifs = [
    "https://lottie.host/ef5b1b63-1148-4fda-81e8-72bbd9f679d3/16dmi187D6.lottie",
    "https://lottie.host/ba50783a-3866-4dfc-83a4-5e8dad91cbbe/KDEdjNfqZ7.lottie"
  ]

  // Auto-switch between GIFs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])
  return (
    <section className="bg-muted relative pb-12 sm:pb-16 lg:pb-20 xl:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated GIFs Section */}
        <div className="flex justify-center mb-6 sm:mb-8 lg:mb-1">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {gifs.map((gifSrc, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentGif === index ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <DotLottieReact
                  src={gifSrc}
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{
                    animation: 'float 3s ease-in-out infinite'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block bg-primary text-primary-foreground neo-border-thick neo-shadow-xl p-3 sm:p-4 lg:p-6 neo-skew mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight neo-text-shadow">
              OUR VISION
            </h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-foreground text-background neo-border-thick neo-shadow-xl p-6 sm:p-8 lg:p-12 neo-rotate mb-8 sm:mb-12">
            <div className="relative">
              <div className="absolute -top-16 sm:-top-15 lg:-top-18 -left-6 sm:-left-8 lg:-left-10 bg-accent neo-border neo-shadow p-2 sm:p-3 lg:p-4">
                <Quote className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-foreground" />
              </div>
              <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight font-black uppercase tracking-wide pt-6 sm:pt-8">
                "APPLYING TO FOREIGN UNIVERSITIES IS A FRAGMENTED AND STRESSFUL PROCESS. ACADEMIA AI SUITE IS HERE TO
                CHANGE THAT. BY UNITING MULTIPLE SPECIALIZED AI AGENTS, WE PROVIDE STUDENTS WITH A CENTRALIZED,
                INTELLIGENT, AND EASY-TO-USE ADMISSIONS ASSISTANT."
              </blockquote>
            </div>
          </div>

          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap">
            <div className="bg-primary text-primary-foreground neo-border neo-shadow-lg p-4 sm:p-5 lg:p-6 neo-rotate neo-animate-bounce">
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              <div className="text-sm sm:text-base lg:text-lg font-black uppercase mt-2">SMART</div>
            </div>
            <div className="bg-secondary text-secondary-foreground neo-border neo-shadow-lg p-4 sm:p-5 lg:p-6 -neo-rotate neo-animate-pulse">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              <div className="text-sm sm:text-base lg:text-lg font-black uppercase mt-2">FAST</div>
            </div>
            <div className="bg-accent text-accent-foreground neo-border neo-shadow-lg p-4 sm:p-5 lg:p-6 neo-rotate neo-animate-shake">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              <div className="text-sm sm:text-base lg:text-lg font-black uppercase mt-2">PRECISE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 sm:top-12 lg:top-20 right-8 sm:right-12 lg:right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-primary neo-border rotate-45 opacity-20"></div>
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-20 left-8 sm:left-12 lg:left-20 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-secondary neo-border -rotate-45 opacity-20"></div>
      </div>
    </section>
  )
}
