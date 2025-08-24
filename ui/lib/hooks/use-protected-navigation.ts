"use client"

import { useAuth } from "./use-auth"
import { useRouter } from "next/navigation"

export function useProtectedNavigation() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const handleProtectedNavigation = (target: string) => {
    if (loading) return

    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    // Routing mappings for authenticated users
    const routeMap: Record<string, string> = {
      "features": "/dashboard",
      "university-recommendation": "/dashboard/university-recommender",
      "resume-analysis": "/dashboard/resume-analyzer",
      "sop": "/dashboard/sop-optimizer",
      "roadmap": "/dashboard/application-tracker",
      "how-it-works": "/dashboard",
      "contact": "/dashboard",
    }

    const route = routeMap[target] || "/dashboard"
    router.push(route)
  }

  return { handleProtectedNavigation, isAuthenticated, loading }
}