"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useAuth } from "@/lib/hooks/use-auth"
import { useProtectedNavigation } from "@/lib/hooks/use-protected-navigation"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const { handleProtectedNavigation } = useProtectedNavigation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", target: "features" },
    { name: "How it Works", target: "how-it-works" },
    { name: "Roadmap", target: "roadmap" },
    { name: "Contact", target: "contact" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-100 ${isScrolled ? "bg-background neo-border-thick neo-shadow" : "bg-background neo-border-thick"
        }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          <div className="flex-shrink-0 min-w-0 flex items-center">
            <div className="flex items-center mr-1 sm:mr-2 md:mr-3">
              <img
                src="/adlogo.png"
                alt="AcademiaAI Logo"
                className="h-15 w-15 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-20 lg:w-20 object-contain flex-shrink-0"
              />
              <h1
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white neo-rotate truncate"
                style={{
                  textShadow: "2px 2px 0px #000000, 4px 4px 0px rgba(0,0,0,0.3), -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000, 1px 1px 0px #000000"
                }}
              >
                <span className="hidden sm:inline">ACADEMIA AI</span>
                <span className="sm:hidden text-sm">ACADEMIA</span>
              </h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleProtectedNavigation(link.target)}
                  className="text-foreground hover:text-primary transition-all duration-100 font-bold uppercase text-sm tracking-wide neo-hover px-4 py-2 neo-border bg-accent hover:bg-secondary cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {loading ? (
              <div className="w-12 h-12 bg-muted neo-border neo-shadow animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <Link href="/signin">
                <Button className="bg-primary text-primary-foreground neo-border neo-shadow neo-hover font-black uppercase text-lg px-8 py-6 tracking-wide">
                  SIGN IN
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button
              className="neo-border neo-shadow bg-accent text-black neo-hover p-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-8 w-8 text-black" /> : <Menu className="h-8 w-8 text-black" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-2 sm:space-y-3 bg-card neo-border neo-shadow-lg mt-3 sm:mt-4 neo-skew mobile-safe-area">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleProtectedNavigation(link.target)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-primary transition-all duration-100 font-bold uppercase text-base sm:text-lg neo-border bg-accent hover:bg-secondary neo-hover mobile-touch-target cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <div className="px-3 py-3 sm:py-4">
                {loading ? (
                  <div className="w-full h-10 sm:h-12 bg-muted neo-border neo-shadow animate-pulse mobile-touch-target"></div>
                ) : isAuthenticated ? (
                  <div className="w-full">
                    <UserProfileDropdown className="w-full" />
                  </div>
                ) : (
                  <Link href="/signin">
                    <Button className="w-full bg-primary text-primary-foreground neo-border neo-shadow font-black uppercase text-base sm:text-lg py-4 sm:py-6 tracking-wide neo-hover mobile-touch-target">
                      SIGN IN
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
