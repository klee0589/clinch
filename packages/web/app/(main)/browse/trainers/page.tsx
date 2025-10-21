"use client";

import { useState } from "react";
import { useTrainers } from "@/hooks/useTrainers";
import { TrainerCard } from "@/components/trainers/TrainerCard";
import { TrainerFilters } from "@/components/trainers/TrainerFilters";

export default function BrowseTrainersPage() {
  const [filters, setFilters] = useState({});
  const { trainers, loading, error } = useTrainers(filters);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Page Header with Gradient */}
      <div className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-red-950/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Find Your Trainer
              </h1>
              <p className="text-lg text-zinc-400">
                Browse{" "}
                <span className="text-red-500 font-semibold">
                  {trainers.length}
                </span>{" "}
                experienced Muay Thai trainers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TrainerFilters onFilterChange={setFilters} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-800"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 absolute top-0 left-0"></div>
                </div>
                <p className="text-zinc-400 mt-6 text-lg font-medium">
                  Finding the best trainers for you...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-600/50 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <>
                {/* Results Header */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-zinc-400 text-sm">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {trainers.length}
                    </span>{" "}
                    result{trainers.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {trainers.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {trainers.map((trainer) => (
                      <TrainerCard key={trainer.id} trainer={trainer} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-2xl backdrop-blur-sm">
                    <div className="text-7xl mb-6 animate-pulse">🥊</div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      No trainers found
                    </h2>
                    <p className="text-zinc-400 text-lg mb-6">
                      Try adjusting your search filters to see more results
                    </p>
                    <button
                      onClick={() => setFilters({})}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
