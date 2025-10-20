"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SessionStatus } from "@clinch/shared";

type ViewMode = "trainee" | "trainer";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [viewMode, setViewMode] = useState<ViewMode>("trainee");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile to determine roles
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;

      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }

    fetchUserProfile();
  }, [user]);

  // Fetch sessions based on view mode
  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        params.append("view", viewMode);

        const response = await fetch(
          `/api/sessions-supabase?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchSessions();
    }
  }, [user, statusFilter, viewMode]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case SessionStatus.PENDING:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case SessionStatus.CONFIRMED:
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case SessionStatus.COMPLETED:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
      case SessionStatus.CANCELLED:
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200";
    }
  };

  const handleAcceptBooking = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions-supabase/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: SessionStatus.CONFIRMED }),
      });

      if (response.ok) {
        // Refresh sessions
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: SessionStatus.CONFIRMED } : s,
          ),
        );
      }
    } catch (err) {
      console.error("Error accepting booking:", err);
    }
  };

  const handleDeclineBooking = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions-supabase/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: SessionStatus.CANCELLED }),
      });

      if (response.ok) {
        // Refresh sessions
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: SessionStatus.CANCELLED } : s,
          ),
        );
      }
    } catch (err) {
      console.error("Error declining booking:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            Clinch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/browse/trainers"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition"
            >
              Find Trainers
            </Link>
            <Link href="/dashboard" className="text-orange-600 font-medium">
              Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {user?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.firstName}
                </span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your training sessions and bookings
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === "trainee" ? "primary" : "ghost"}
            onClick={() => setViewMode("trainee")}
          >
            My Bookings
          </Button>
          <Button
            variant={viewMode === "trainer" ? "primary" : "ghost"}
            onClick={() => setViewMode("trainer")}
          >
            Booking Requests
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={statusFilter === undefined ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter(undefined)}
          >
            All Sessions
          </Button>
          <Button
            variant={
              statusFilter === SessionStatus.PENDING ? "primary" : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(SessionStatus.PENDING)}
          >
            Pending
          </Button>
          <Button
            variant={
              statusFilter === SessionStatus.CONFIRMED ? "primary" : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(SessionStatus.CONFIRMED)}
          >
            Confirmed
          </Button>
          <Button
            variant={
              statusFilter === SessionStatus.COMPLETED ? "primary" : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(SessionStatus.COMPLETED)}
          >
            Completed
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading sessions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        {!loading && !error && (
          <>
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session: any) => (
                  <Card key={session.id} hover>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Session Info */}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {viewMode === "trainee"
                                ? `${session.trainer?.user?.firstName || "Unknown"} ${session.trainer?.user?.lastName || "Trainer"}`
                                : `${session.trainee?.user?.firstName || "Unknown"} ${session.trainee?.user?.lastName || "Trainee"}`}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(session.status)}`}
                            >
                              {session.status}
                            </span>
                          </div>

                          {/* Date & Time */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>📅 {formatDate(session.scheduledAt)}</span>
                            <span>⏱️ {session.duration} minutes</span>
                            <span>
                              {session.isOnline ? "💻 Online" : "📍 In-Person"}
                            </span>
                          </div>

                          {/* Location */}
                          {session.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Location: {session.location}
                            </p>
                          )}

                          {/* Notes */}
                          {session.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                            ${session.price}
                          </div>

                          {/* Trainer Actions for Pending Requests */}
                          {viewMode === "trainer" &&
                            session.status === SessionStatus.PENDING && (
                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() =>
                                    handleAcceptBooking(session.id)
                                  }
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleDeclineBooking(session.id)
                                  }
                                >
                                  Decline
                                </Button>
                              </div>
                            )}

                          {/* Payment Status */}
                          {!session.paid &&
                            session.status === SessionStatus.CONFIRMED && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded mt-2">
                                Payment Pending
                              </span>
                            )}
                          {session.paid && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded mt-2">
                              ✓ Paid
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent>
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📅</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {viewMode === "trainee"
                        ? "No bookings yet"
                        : "No booking requests yet"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {viewMode === "trainee"
                        ? "Book your first session with a trainer to get started"
                        : "Booking requests from trainees will appear here"}
                    </p>
                    {viewMode === "trainee" && (
                      <Link href="/browse/trainers">
                        <Button>Find Trainers</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
