"use client"
import { GraduationCap, FileText, PenTool } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: GraduationCap,
      title: "UNIVERSITY RECOMMENDATION",
      description:
        "AI-POWERED PREDICTIONS TAILORED TO YOUR GRE, TOEFL, AND GPA. FIND OUT WHICH UNIVERSITIES MATCH YOUR PROFILE, FROM TOP-TIER TO SAFE OPTIONS.",
      bgColor: "bg-primary",
      textColor: "text-primary-foreground",
      emoji: "🎓",
    },
    {
      icon: FileText,
      title: "RESUME ANALYSIS",
      description:
        "GET YOUR RESUME ANALYZED WITH ATS-STYLE SCORING. RECEIVE PERSONALIZED, ACTIONABLE FEEDBACK TO STRENGTHEN YOUR PROFILE AND STAND OUT.",
      bgColor: "bg-secondary",
      textColor: "text-secondary-foreground",
      emoji: "📄",
    },
    {
      icon: PenTool,
      title: "SOP CRAFTER",
      description:
        "LEVERAGE CUTTING-EDGE AI TO DRAFT AND REFINE YOUR STATEMENT OF PURPOSE. ENSURE CLARITY, ORIGINALITY, AND ALIGNMENT WITH YOUR TARGET UNIVERSITIES.",
      bgColor: "bg-accent",
      textColor: "text-accent-foreground",
      emoji: "✍️",
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block bg-foreground text-background neo-border neo-shadow-xl-gray p-3 sm:p-4 lg:p-6 neo-skew mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight neo-text-shadow">
              3 CORE PILLARS
            </h2>
          </div>
          <div className="bg-accent text-foreground neo-border neo-shadow p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto neo-rotate">
            <p className="text-sm sm:text-lg lg:text-xl font-bold uppercase tracking-wide">
              EVERYTHING YOU NEED TO SUCCEED IN YOUR UNIVERSITY APPLICATION JOURNEY, POWERED BY ADVANCED AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`${feature.bgColor} ${feature.textColor} neo-border-thick neo-shadow-xl neo-hover p-4 sm:p-6 lg:p-8 ${index % 2 === 0 ? "neo-rotate" : "-neo-rotate"
                }`}
            >
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 neo-animate-bounce">{feature.emoji}</div>
                <h3
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black uppercase tracking-tight mb-4 sm:mb-6 text-white"
                  style={{ textShadow: "3px 3px 0px #000000, 6px 6px 0px rgba(0,0,0,0.3)" }}
                >
                  {feature.title}
                </h3>
              </div>

              <div className="bg-background text-foreground neo-border p-3 sm:p-4 lg:p-6 neo-skew">
                <p className="text-sm sm:text-base lg:text-lg font-bold uppercase tracking-wide leading-tight">{feature.description}</p>
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center">
                <div className="bg-background text-foreground neo-border neo-shadow p-3 sm:p-4 neo-hover">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-primary neo-border neo-shadow w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 neo-rotate neo-animate-pulse"></div>
          <div className="bg-secondary neo-border neo-shadow w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 -neo-rotate neo-animate-bounce"></div>
          <div className="bg-accent neo-border neo-shadow w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 neo-rotate neo-animate-shake"></div>
        </div>
      </div>
    </section>
  )
}
