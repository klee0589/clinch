"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrainers } from "@/hooks/useTrainers";
import { TrainerCard } from "@/components/trainers/TrainerCard";
import { TrainerFilters } from "@/components/trainers/TrainerFilters";
import { Map } from "@/components/map/Map";
import { geocodeLocation, getFallbackCoordinates } from "@/lib/geocode";

export default function BrowseTrainersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const { trainers, loading, error } = useTrainers(filters);

  // Geocode trainer locations for map view
  useEffect(() => {
    if (viewMode === "map" && trainers.length > 0) {
      const geocodeTrainers = async () => {
        const markers = await Promise.all(
          trainers.map(async (trainer: any) => {
            // Try geocoding first
            let coords = await geocodeLocation(
              trainer.city,
              trainer.state,
              trainer.country,
            );

            // Fallback to common city coordinates if geocoding fails
            if (!coords) {
              coords = getFallbackCoordinates(trainer.city);
            }

            // If we have coordinates, create a marker
            if (coords) {
              return {
                id: trainer.id,
                longitude: coords.longitude,
                latitude: coords.latitude,
                title: `${trainer.user?.firstName} ${trainer.user?.lastName}`,
                description: `${trainer.city || ""}, ${trainer.state || ""} • $${trainer.hourlyRate}/hr`,
                color: "#FF6B35",
              };
            }
            return null;
          }),
        );

        // Filter out null markers (trainers without coordinates)
        setMapMarkers(markers.filter((m) => m !== null));
      };

      geocodeTrainers();
    }
  }, [viewMode, trainers]);

  const handleMarkerClick = (trainerId: string) => {
    router.push(`/browse/trainers/${trainerId}`);
  };

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

            {/* View Toggle */}
            <div className="flex gap-2 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  List
                </span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === "map"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Map
                </span>
              </button>
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

                {/* Map View */}
                {viewMode === "map" && (
                  <div className="space-y-4">
                    <Map
                      markers={mapMarkers}
                      height="600px"
                      onMarkerClick={handleMarkerClick}
                      zoom={4}
                    />
                    {mapMarkers.length === 0 && trainers.length > 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm">
                          Some trainers don't have location data and aren't
                          shown on the map.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
