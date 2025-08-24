"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileDropdownProps {
  className?: string;
}

export function UserProfileDropdown({ className }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      action: () => handleNavigation("/profile"),
      color: "hover:bg-accent"
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      action: () => handleNavigation("/dashboard"),
      color: "hover:bg-secondary"
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      color: "hover:bg-destructive hover:text-destructive-foreground"
    }
  ];

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Profile Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost2"
        className={cn(
          "rounded-full bg-primary text-primary-foreground neo-border neo-shadow neo-hover p-0 relative overflow-hidden",
          // Responsive sizing
          className?.includes("w-full") ? "w-full h-12" : "w-10 h-10 sm:w-12 sm:h-12"
        )}
        size="icon"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-black text-xs sm:text-sm neo-border-0">
          {getUserInitials()}
        </div>
        <ChevronDown
          className={cn(
            "absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute bg-card neo-border neo-shadow-xl z-50 animate-in slide-in-from-top-2 duration-200",
          // Responsive positioning and sizing
          className?.includes("w-full")
            ? "left-0 right-0 top-14 w-full mx-4"
            : "right-0 top-12 sm:top-14 w-64 sm:w-72 md:w-80"
        )}>
          {/* User Info Header */}
          <div className="p-3 sm:p-4 border-b-4 border-border bg-muted">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black neo-border text-xs sm:text-sm">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-foreground truncate uppercase tracking-wider">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={item.action}
                variant="ghost2"
                className={cn(
                  "w-full justify-start h-10 sm:h-12 text-left font-bold uppercase tracking-wider text-xs sm:text-sm neo-border mb-1 sm:mb-2 last:mb-0",
                  "bg-background hover:transform hover:translate-x-1 transition-all duration-150",
                  item.color
                )}
              >
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 sm:p-3 border-t-4 border-border bg-muted text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              AcademiaAI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}