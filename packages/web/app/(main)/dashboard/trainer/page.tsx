import Link from "next/link";

// Mock data
const upcomingSessions = [
  {
    id: "1",
    traineeName: "Mike Thompson",
    date: "Today",
    time: "2:00 PM",
    duration: 60,
    location: "LA Muay Thai Academy",
    status: "Confirmed",
  },
  {
    id: "2",
    traineeName: "Sarah Johnson",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: 90,
    location: "Golden Tiger Gym",
    status: "Confirmed",
  },
  {
    id: "3",
    traineeName: "David Lee",
    date: "Wed, Oct 23",
    time: "4:00 PM",
    duration: 60,
    location: "Online",
    status: "Pending",
  },
];

const recentMessages = [
  {
    id: "1",
    from: "Alex Martinez",
    message:
      "Hi! I'm interested in starting training. Do you have availability next week?",
    time: "10 min ago",
    unread: true,
  },
  {
    id: "2",
    from: "Jennifer Kim",
    message: "Thanks for the great session today! See you next week.",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "3",
    from: "Tom Bradley",
    message: "Can we reschedule Friday's session to Saturday?",
    time: "5 hours ago",
    unread: true,
  },
];

const stats = {
  totalSessions: 342,
  thisMonth: 28,
  upcomingBookings: 12,
  averageRating: 4.9,
  earnings: {
    thisMonth: 2240,
    lastMonth: 2080,
  },
};

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Clinch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/trainer" className="text-white">
              Dashboard
            </Link>
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
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold">
              J
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Trainer Dashboard
          </h1>
          <p className="text-zinc-400">
            Manage your sessions, clients, and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Total Sessions</div>
            <div className="text-3xl font-bold text-white">
              {stats.totalSessions}
            </div>
            <div className="text-sm text-green-400 mt-2">
              ↑ {stats.thisMonth} this month
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Upcoming Bookings</div>
            <div className="text-3xl font-bold text-white">
              {stats.upcomingBookings}
            </div>
            <div className="text-sm text-zinc-400 mt-2">Next 30 days</div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Average Rating</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              {stats.averageRating}
              <span className="text-yellow-500 text-2xl">⭐</span>
            </div>
            <div className="text-sm text-zinc-400 mt-2">From 89 reviews</div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">
              Earnings (This Month)
            </div>
            <div className="text-3xl font-bold text-white">
              ${stats.earnings.thisMonth}
            </div>
            <div className="text-sm text-green-400 mt-2">
              ↑ ${stats.earnings.thisMonth - stats.earnings.lastMonth} vs last
              month
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Upcoming Sessions
                </h2>
                <Link
                  href="/dashboard/trainer/schedule"
                  className="text-red-600 hover:text-red-500 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-red-600 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">
                          {session.traineeName}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {session.date} at {session.time} · {session.duration}{" "}
                          min
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          session.status === "Confirmed"
                            ? "bg-green-900/30 text-green-400 border border-green-700"
                            : "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span>📍</span>
                      {session.location}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm transition">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-red-600 transition text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-white font-medium">Set Availability</div>
              </button>
              <button className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-red-600 transition text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-white font-medium">View Analytics</div>
              </button>
              <button className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-red-600 transition text-center">
                <div className="text-3xl mb-2">✏️</div>
                <div className="text-white font-medium">Edit Profile</div>
              </button>
            </div>
          </div>

          {/* Messages & Notifications */}
          <div className="space-y-6">
            {/* Messages */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Messages</h2>
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  2 new
                </span>
              </div>

              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      msg.unread
                        ? "bg-zinc-900 border border-red-600"
                        : "bg-zinc-900 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-white font-medium text-sm">
                        {msg.from}
                      </span>
                      <span className="text-zinc-500 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition text-sm">
                View All Messages
              </button>
            </div>

            {/* Pending Requests */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Booking Requests
              </h2>
              <div className="text-center py-4">
                <div className="text-4xl mb-2">📬</div>
                <p className="text-zinc-400 text-sm">No pending requests</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
