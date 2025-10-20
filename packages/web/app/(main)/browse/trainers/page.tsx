"use client";

import { useState } from "react";
import { useTrainers } from "@/hooks/useTrainers";
import { TrainerCard } from "@/components/trainers/TrainerCard";
import { TrainerFilters } from "@/components/trainers/TrainerFilters";

export default function BrowseTrainersPage() {
  const [filters, setFilters] = useState({});
  const { trainers, loading, error } = useTrainers(filters);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Find Your Trainer
        </h1>
        <p className="text-zinc-400">
          Browse experienced Muay Thai trainers in your area
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <TrainerFilters onFilterChange={setFilters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-zinc-400">Finding trainers...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              <div className="mb-4">
                <p className="text-zinc-400">
                  Found {trainers.length} trainer
                  {trainers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {trainers.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {trainers.map((trainer) => (
                    <TrainerCard key={trainer.id} trainer={trainer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <div className="text-6xl mb-4">🥊</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    No trainers found
                  </h2>
                  <p className="text-zinc-400">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
