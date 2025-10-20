"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { BookingForm } from "@/components/sessions/BookingForm";
import type { TrainerProfile } from "@clinch/shared";

interface TrainerWithUser extends TrainerProfile {
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    email?: string;
  };
  gyms?: Array<{
    gym: {
      name: string;
      city?: string;
      state?: string;
      country?: string;
    };
  }>;
}

export default function TrainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [trainer, setTrainer] = useState<TrainerWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [traineeProfileId, setTraineeProfileId] = useState<string | null>(null);

  const trainerId = params.id as string;

  useEffect(() => {
    async function fetchTrainer() {
      try {
        setLoading(true);
        const response = await fetch(`/api/trainers-supabase/${trainerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trainer");
        }
        const data = await response.json();
        setTrainer(data);
      } catch (err) {
        console.error("Error fetching trainer:", err);
        setError("Failed to load trainer profile");
      } finally {
        setLoading(false);
      }
    }

    if (trainerId) {
      fetchTrainer();
    }
  }, [trainerId]);

  useEffect(() => {
    async function fetchTraineeProfile() {
      if (!clerkUser) return;

      try {
        // First get the user
        const userResponse = await fetch("/api/users/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Then get their trainee profile
          const profileResponse = await fetch(
            `/api/trainee-profile?userId=${userData.id}`,
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setTraineeProfileId(profileData.id);
          }
        }
      } catch (err) {
        console.error("Error fetching trainee profile:", err);
      }
    }

    fetchTraineeProfile();
  }, [clerkUser]);

  const handleBookingClick = () => {
    if (!clerkUser) {
      router.push("/sign-in");
      return;
    }

    if (!traineeProfileId) {
      alert(
        "You need to have a trainee profile to book sessions. Please update your profile to include trainee role.",
      );
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading trainer profile...</div>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || "Trainer not found"}
          </div>
          <Link
            href="/browse/trainers"
            className="text-zinc-400 hover:text-white transition"
          >
            ← Back to trainers
          </Link>
        </div>
      </div>
    );
  }

  const fullName = trainer.user
    ? `${trainer.user.firstName || ""} ${trainer.user.lastName || ""}`.trim() ||
      "Unknown Trainer"
    : "Unknown Trainer";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Clinch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/browse/trainers"
              className="text-zinc-300 hover:text-white transition"
            >
              Find Trainers
            </Link>
            <Link
              href="/browse/gyms"
              className="text-zinc-300 hover:text-white transition"
            >
              Find Gyms
            </Link>
            {clerkUser ? (
              <Link
                href="/dashboard"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-zinc-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/browse/trainers"
          className="inline-flex items-center text-zinc-400 hover:text-white transition mb-6"
        >
          ← Back to trainers
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                {trainer.user?.imageUrl ? (
                  <img
                    src={trainer.user.imageUrl}
                    alt={fullName}
                    className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {fullName.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {fullName}
                  </h1>
                  {trainer.city && (
                    <p className="text-zinc-400 mb-3">
                      {trainer.city}, {trainer.state || trainer.country}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    {trainer.averageRating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>⭐</span>
                        <span className="font-medium text-white">
                          {trainer.averageRating.toFixed(1)}
                        </span>
                        {trainer.totalSessions && (
                          <span className="text-zinc-500 text-sm">
                            ({trainer.totalSessions} sessions)
                          </span>
                        )}
                      </div>
                    )}
                    {trainer.experienceYears && (
                      <div className="text-zinc-400 text-sm">
                        {trainer.experienceYears} years experience
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialties &&
                      trainer.specialties.length > 0 &&
                      trainer.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-sm text-zinc-300"
                        >
                          {specialty.replace("_", " ")}
                        </span>
                      ))}
                    {trainer.availableForOnline && (
                      <span className="px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-sm text-green-400">
                        Online Sessions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            {trainer.bio && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-zinc-300 leading-relaxed">{trainer.bio}</p>
              </div>
            )}

            {/* Certifications */}
            {trainer.certifications && trainer.certifications.length > 0 && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Certifications
                </h2>
                <ul className="space-y-2">
                  {trainer.certifications.map((cert) => (
                    <li
                      key={cert}
                      className="flex items-center gap-2 text-zinc-300"
                    >
                      <span className="text-green-500">✓</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Training Locations */}
            {trainer.gyms && trainer.gyms.length > 0 && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Training Locations
                </h2>
                <div className="space-y-3">
                  {trainer.gyms.map((gymRelation, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <div className="text-white font-medium">
                          {gymRelation.gym.name}
                        </div>
                        {gymRelation.gym.city && (
                          <div className="text-zinc-400 text-sm">
                            {gymRelation.gym.city}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                {trainer.hourlyRate ? (
                  <>
                    <div className="text-4xl font-bold text-white mb-1">
                      ${trainer.hourlyRate}
                      <span className="text-xl text-zinc-400">/hr</span>
                    </div>
                    <div className="text-sm text-zinc-400">per session</div>
                  </>
                ) : (
                  <div className="text-zinc-400">Contact for pricing</div>
                )}
              </div>

              <button
                onClick={handleBookingClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition mb-3"
              >
                Book a Session
              </button>

              <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold transition border border-zinc-700">
                Send Message
              </button>

              <div className="mt-6 pt-6 border-t border-zinc-700 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Response time</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
                {trainer.languages && trainer.languages.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Languages</span>
                    <span className="text-white">
                      {trainer.languages.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && traineeProfileId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Book a Session with {fullName}
              </h2>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-zinc-400 hover:text-white transition text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <BookingForm
                trainerId={trainer.id}
                traineeId={traineeProfileId}
                trainerRate={trainer.hourlyRate || 0}
                onSuccess={handleBookingSuccess}
                onCancel={() => setIsBookingModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
