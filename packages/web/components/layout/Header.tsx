"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Clinch
        </Link>
        <div className="flex items-center gap-6">
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
          {isSignedIn ? (
            <UserMenu />
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
  );
}
