"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary neo-border neo-shadow-xl animate-pulse mx-auto mb-4"></div>
          <p className="text-lg font-bold uppercase tracking-wider neo-text-shadow-black">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
