"use client";

import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.primaryEmailAddress?.emailAddress || ""}
                disabled
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                disabled
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Notifications
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-zinc-400">
              Notification preferences will be available soon.
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Privacy & Security
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-zinc-400">
              Privacy settings will be available soon.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
