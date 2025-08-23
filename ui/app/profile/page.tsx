"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  Globe,
  ArrowLeft,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    location: "",
    dateOfBirth: "",
    bio: ""
  });

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

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

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { key: "displayName", label: "Full Name", icon: User, type: "text" },
        { key: "email", label: "Email Address", icon: Mail, type: "email", disabled: true },
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
        { key: "location", label: "Location", icon: MapPin, type: "text" },
        { key: "dateOfBirth", label: "Date of Birth", icon: Calendar, type: "date" }
      ]
    }
  ];

  const settingsOptions = [
    {
      title: "Privacy & Security",
      icon: Shield,
      options: [
        { label: "Two-factor authentication", value: "2fa", enabled: false },
        { label: "Login notifications", value: "login_notifications", enabled: true },
        { label: "Profile visibility", value: "profile_visibility", enabled: true }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      options: [
        { label: "Email notifications", value: "email_notifications", enabled: true },
        { label: "Application reminders", value: "app_reminders", enabled: true },
        { label: "Deadline alerts", value: "deadline_alerts", enabled: true }
      ]
    },
    {
      title: "Preferences",
      icon: Globe,
      options: [
        { label: "Dark mode", value: "dark_mode", enabled: false },
        { label: "Email digest", value: "email_digest", enabled: true },
        { label: "Marketing emails", value: "marketing", enabled: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card neo-border-thick neo-shadow sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="flex items-center gap-2 neo-border bg-background hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase tracking-wider">Back to Home</span>
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider neo-heading text-primary">
            User Profile
          </h1>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Profile Header */}
        <div className="bg-card neo-border neo-shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary text-primary-foreground flex items-center justify-center neo-border text-3xl font-black">
                {getUserInitials()}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary hover:bg-secondary/90 neo-border"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-wider neo-text-shadow-black mb-2">
                {user?.displayName || "User"}
              </h2>
              <p className="text-muted-foreground font-medium mb-4">{user?.email}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-bold uppercase tracking-wider"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
                {isEditing && (
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="font-bold uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-background p-4 neo-border">
                <div className="text-2xl font-black text-primary">8</div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applications</p>
              </div>
              <div className="bg-background p-4 neo-border">
                <div className="text-2xl font-black text-secondary">3</div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SOPs</p>
              </div>
              <div className="bg-background p-4 neo-border">
                <div className="text-2xl font-black text-accent">12</div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Universities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-card neo-border neo-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center neo-border">
                <section.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider neo-text-shadow-black">
                {section.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <Label htmlFor={field.key} className="flex items-center gap-2">
                    <field.icon className="w-4 h-4" />
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    value={profileData[field.key as keyof typeof profileData]}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      [field.key]: e.target.value
                    })}
                    disabled={field.disabled || !isEditing}
                    className={cn(
                      "text-base",
                      field.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Bio Section */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Bio
              </Label>
              <textarea
                id="bio"
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 neo-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        ))}

        {/* Settings Sections */}
        {settingsOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-card neo-border neo-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary flex items-center justify-center neo-border">
                <section.icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider neo-text-shadow-black">
                {section.title}
              </h3>
            </div>

            <div className="space-y-4">
              {section.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center justify-between p-4 bg-background neo-border">
                  <div>
                    <p className="font-bold uppercase tracking-wider text-sm">{option.label}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant={option.enabled ? "default" : "outline"}
                      size="sm"
                      className="font-bold uppercase tracking-wider text-xs"
                    >
                      {option.enabled ? "ON" : "OFF"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account Actions */}
        <div className="bg-card neo-border neo-shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-destructive flex items-center justify-center neo-border">
              <Settings className="w-5 h-5 text-destructive-foreground" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-wider neo-text-shadow-black">
              Account Actions
            </h3>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 mr-2" />
              Update Email
            </Button>
            <Button variant="outline" className="w-full font-bold uppercase tracking-wider text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}