"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserRole } from "@clinch/shared";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  // Check if user has already completed onboarding
  useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;

      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const userData = await response.json();
          // If user already has a role set, redirect to dashboard
          if (userData.role && userData.role !== "ADMIN") {
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setChecking(false);
      }
    }

    checkOnboarding();
  }, [user, router]);

  const handleRoleSelect = async () => {
    if (!selectedRole || !user) return;

    setLoading(true);
    try {
      // Call onboarding API to set role and create profile
      const response = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Redirect based on role
      if (
        selectedRole === UserRole.TRAINER ||
        selectedRole === UserRole.GYM_OWNER
      ) {
        router.push("/dashboard");
      } else {
        router.push("/browse/trainers");
      }
    } catch (error) {
      console.error("Error setting up account:", error);
      setLoading(false);
    }
  };

  const roles = [
    {
      value: UserRole.TRAINEE,
      title: "I want to train",
      description: "Find experienced trainers and book sessions",
      icon: "🥊",
    },
    {
      value: UserRole.TRAINER,
      title: "I'm a trainer",
      description: "Connect with students and grow your business",
      icon: "👊",
    },
    {
      value: UserRole.GYM_OWNER,
      title: "I own a gym",
      description: "Promote your facility and attract members",
      icon: "🏛️",
    },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Clinch!
          </h1>
          <p className="text-xl text-zinc-400">
            How would you like to use Clinch?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`p-8 rounded-xl border-2 transition-all text-left ${
                selectedRole === role.value
                  ? "border-red-600 bg-red-600/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
              }`}
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {role.title}
              </h3>
              <p className="text-zinc-400">{role.description}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
