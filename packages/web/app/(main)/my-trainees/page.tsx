"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Trainee {
  id: string;
  userId: string;
  goals: string[];
  experienceLevel: string;
  fitnessLevel: string;
  user: {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  sessionCount: number;
  lastSessionDate: string | null;
  noteCount: number;
  mediaCount: number;
}

export default function MyTraineesPage() {
  const { user } = useUser();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainees();
  }, []);

  async function fetchTrainees() {
    try {
      setLoading(true);
      const response = await fetch("/api/trainer-trainees");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch trainees");
      }

      const data = await response.json();
      setTrainees(data.data || []);
    } catch (err: any) {
      console.error("Error fetching trainees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Trainees</h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Trainees</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Trainees
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage profiles, notes, and progress for your trainees
          </p>
        </div>

        {/* Empty State */}
        {trainees.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🥊</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Trainees Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Once you complete paid sessions, your trainees will appear here.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        )}

        {/* Trainees Grid */}
        {trainees.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainees.map((trainee) => (
              <Link
                key={trainee.id}
                href={`/my-trainees/${trainee.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Trainee Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      {trainee.user.imageUrl ? (
                        <img
                          src={trainee.user.imageUrl}
                          alt={`${trainee.user.firstName} ${trainee.user.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                            {trainee.user.firstName?.[0]}
                            {trainee.user.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {trainee.user.firstName} {trainee.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {trainee.experienceLevel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 space-y-3">
                  {/* Sessions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Sessions
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {trainee.sessionCount}
                    </span>
                  </div>

                  {/* Last Session */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Session
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(trainee.lastSessionDate)}
                    </span>
                  </div>

                  {/* Notes */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      📝 Notes
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {trainee.noteCount}
                    </span>
                  </div>

                  {/* Media */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      📸 Media
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {trainee.mediaCount}
                    </span>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="px-6 pb-6">
                  <div className="w-full bg-indigo-600 text-white text-center py-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                    View Profile
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
