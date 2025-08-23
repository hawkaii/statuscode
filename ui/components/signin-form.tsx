"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  X,
  Github,
  Chrome // Using Chrome icon for Google
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        setError("Name is required for sign up");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        const result = await signUp(formData.email, formData.password, formData.name);

        if (result.error) {
          setError(result.error.message || "Sign up failed");
        } else {
          setSuccess("Account created successfully! You can now sign in.");
          setIsSignUp(false);
          setFormData(prev => ({ ...prev, name: "", confirmPassword: "" }));
        }
      } else {
        const result = await signIn(formData.email, formData.password);

        if (result.error) {
          setError(result.error.message || "Sign in failed");
        } else {
          setSuccess("Signed in successfully!");
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Social authentication handlers
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error.message || "Google sign in failed");
      } else {
        setSuccess("Signed in with Google successfully!");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithGithub();
      if (result.error) {
        setError(result.error.message || "GitHub sign in failed");
      } else {
        setSuccess("Signed in with GitHub successfully!");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "GitHub sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto p-8 bg-card neo-border neo-shadow-xl relative",
      "animate-in slide-in-from-bottom-4 duration-500",
      className
    )}>
      {/* Close Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-8 w-8 neo-border bg-background hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
        onClick={() => router.push("/")}
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Header with Modern Neo-Brutalist Styling */}
      <div className="text-center mb-8 mt-4">
        <div className="relative mb-4">
          <h1 className="text-2xl font-black uppercase tracking-wider mb-2 text-background bg-accent px-6 py-3 neo-border transform -rotate-1 inline-block neo-heading relative z-10">
            {isSignUp ? "Join the" : "Welcome"}
          </h1>
        </div>

        <div className="relative mb-6">
          <h2 className="text-3xl font-black uppercase tracking-wider text-primary mb-4 relative inline-block">
            <span className="relative z-20 bg-background px-6 py-3 neo-border transform rotate-1 neo-text-filled">
              UNICOMPASS TEAM
            </span>
            <div className="absolute inset-0 bg-secondary transform translate-x-3 translate-y-3 neo-border z-10"></div>
            <div className="absolute inset-0 bg-accent transform translate-x-6 translate-y-6 neo-border z-0"></div>
          </h2>
        </div>

        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-12 h-3 bg-secondary neo-border transform -skew-x-12"></div>
          <div className="w-8 h-3 bg-primary neo-border transform skew-x-12"></div>
          <div className="w-12 h-3 bg-accent neo-border transform -skew-x-12"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field for sign up */}
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="text-base"
            />
          </div>
        )}

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            className="text-base"
          />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="text-base pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Confirm Password field for sign up */}
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className="text-base"
            />
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 bg-destructive/20 neo-border border-destructive neo-shadow">
            <p className="text-destructive font-bold text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-secondary/20 neo-border border-secondary neo-shadow">
            <p className="text-secondary-foreground font-bold text-sm">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
              {isSignUp ? "Creating Account..." : "Signing In..."}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>

        {/* Social Authentication - Single Row */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-border neo-shadow-mobile"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Or Continue With
            </span>
            <div className="h-1 flex-1 bg-border neo-shadow-mobile"></div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14"
              onClick={handleGithubSignIn}
              disabled={isLoading}
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>

        {/* Toggle between sign in/sign up */}
        <div className="text-center pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setSuccess("");
              setFormData({ email: "", password: "", name: "", confirmPassword: "" });
            }}
            className="text-base hover:text-primary"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"
              }
            </div>
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t-4 border-border text-center">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Powered by Firebase Auth
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <div className="w-2 h-2 bg-primary neo-shadow-mobile"></div>
          <div className="w-2 h-2 bg-secondary neo-shadow-mobile"></div>
          <div className="w-2 h-2 bg-accent neo-shadow-mobile"></div>
        </div>
      </div>
    </div>
  );
}