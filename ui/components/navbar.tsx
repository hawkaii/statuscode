"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useAuth } from "@/lib/hooks/use-auth"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-100 ${isScrolled ? "bg-background neo-border-thick neo-shadow" : "bg-background neo-border-thick"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <h1
              className="text-3xl font-black uppercase tracking-tight text-white neo-rotate"
              style={{ textShadow: "3px 3px 0px #000000, 6px 6px 0px rgba(0,0,0,0.3)" }}
            >
              UNICOMPASS
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-all duration-100 font-bold uppercase text-sm tracking-wide neo-hover px-4 py-2 neo-border bg-accent hover:bg-secondary"
                >
                  {link.name}
                </a>
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
              className="neo-border neo-shadow bg-accent text-foreground neo-hover p-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-4 pb-6 space-y-3 bg-card neo-border neo-shadow-lg mt-4 neo-skew">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-6 py-4 text-foreground hover:text-primary transition-all duration-100 font-bold uppercase text-lg neo-border bg-accent hover:bg-secondary neo-hover"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="px-3 py-4">
                {loading ? (
                  <div className="w-full h-12 bg-muted neo-border neo-shadow animate-pulse"></div>
                ) : isAuthenticated ? (
                  <UserProfileDropdown className="w-full" />
                ) : (
                  <Link href="/signin">
                    <Button className="w-full bg-primary text-primary-foreground neo-border neo-shadow font-black uppercase text-lg py-6 tracking-wide neo-hover">
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
