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
    <section id="features" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-foreground text-background neo-border neo-shadow-xl p-8 neo-skew mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight neo-text-shadow">
              3 CORE PILLARS
            </h2>
          </div>
          <div className="bg-accent text-foreground neo-border neo-shadow p-6 max-w-4xl mx-auto neo-rotate">
            <p className="text-xl font-bold uppercase tracking-wide">
              EVERYTHING YOU NEED TO SUCCEED IN YOUR UNIVERSITY APPLICATION JOURNEY, POWERED BY ADVANCED AI
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`${feature.bgColor} ${feature.textColor} neo-border-thick neo-shadow-xl neo-hover p-8 ${
                index % 2 === 0 ? "neo-rotate" : "-neo-rotate"
              }`}
            >
              <div className="text-center mb-8">
                <div className="text-8xl mb-6 neo-animate-bounce">{feature.emoji}</div>
                <h3
                  className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6 text-white"
                  style={{ textShadow: "3px 3px 0px #000000, 6px 6px 0px rgba(0,0,0,0.3)" }}
                >
                  {feature.title}
                </h3>
              </div>

              <div className="bg-background text-foreground neo-border p-6 neo-skew">
                <p className="text-lg font-bold uppercase tracking-wide leading-tight">{feature.description}</p>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="bg-background text-foreground neo-border neo-shadow p-4 neo-hover">
                  <feature.icon className="w-12 h-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center gap-8">
          <div className="bg-primary neo-border neo-shadow w-20 h-20 neo-rotate neo-animate-pulse"></div>
          <div className="bg-secondary neo-border neo-shadow w-16 h-16 -neo-rotate neo-animate-bounce"></div>
          <div className="bg-accent neo-border neo-shadow w-24 h-24 neo-rotate neo-animate-shake"></div>
        </div>
      </div>
    </section>
  )
}
