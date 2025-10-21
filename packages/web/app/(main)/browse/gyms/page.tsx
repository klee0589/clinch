"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Map } from "@/components/map/Map";
import { geocodeLocation, getFallbackCoordinates } from "@/lib/geocode";

// Mock data for now
const mockGyms = [
  {
    id: "1",
    name: "LA Muay Thai Academy",
    description:
      "Premier training facility with authentic Thai equipment and professional coaching staff.",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    amenities: [
      "Heavy Bags",
      "Muay Thai Ring",
      "Showers",
      "Parking",
      "Pro Shop",
    ],
    membershipFee: 150,
    dropInFee: 25,
    averageRating: 4.8,
    photos: [],
  },
  {
    id: "2",
    name: "Golden Tiger Gym",
    description:
      "Traditional Muay Thai gym with experienced fighters and welcoming atmosphere for all levels.",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    amenities: [
      "Heavy Bags",
      "Speed Bags",
      "Boxing Ring",
      "Changing Rooms",
      "Locker Rentals",
    ],
    membershipFee: 120,
    dropInFee: 20,
    averageRating: 4.9,
    photos: [],
  },
  {
    id: "3",
    name: "Iron Fist Training Center",
    description:
      "Modern facility combining Muay Thai with strength and conditioning programs.",
    address: "789 Fitness Blvd",
    city: "Los Angeles",
    state: "CA",
    amenities: [
      "Heavy Bags",
      "Muay Thai Ring",
      "Cardio Equipment",
      "Strength Training",
      "Sauna",
      "Physical Therapy",
    ],
    membershipFee: 180,
    dropInFee: 30,
    averageRating: 4.7,
    photos: [],
  },
];

export default function BrowseGymsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  // Geocode gym locations for map view
  useEffect(() => {
    if (viewMode === "map" && mockGyms.length > 0) {
      const geocodeGyms = async () => {
        const markers = await Promise.all(
          mockGyms.map(async (gym: any) => {
            // Try geocoding first
            let coords = await geocodeLocation(gym.city, gym.state, "USA");

            // Fallback to common city coordinates if geocoding fails
            if (!coords) {
              coords = getFallbackCoordinates(gym.city);
            }

            // If we have coordinates, create a marker
            if (coords) {
              return {
                id: gym.id,
                longitude: coords.longitude,
                latitude: coords.latitude,
                title: gym.name,
                description: `${gym.city}, ${gym.state} • $${gym.membershipFee}/mo`,
                color: "#FF6B35",
              };
            }
            return null;
          }),
        );

        // Filter out null markers (gyms without coordinates)
        setMapMarkers(markers.filter((m) => m !== null));
      };

      geocodeGyms();
    }
  }, [viewMode]);

  const handleMarkerClick = (gymId: string) => {
    router.push(`/browse/gyms/${gymId}`);
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
                Find a Gym
              </h1>
              <p className="text-lg text-zinc-400">
                Discover{" "}
                <span className="text-red-500 font-semibold">
                  {mockGyms.length}
                </span>{" "}
                Muay Thai training facilities
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
        {/* Filters */}
        <div className="mb-8 p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City or ZIP code"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Amenities
              </label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>All Amenities</option>
                <option>Muay Thai Ring</option>
                <option>Heavy Bags</option>
                <option>Showers</option>
                <option>Parking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Price Range
              </label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>Any Price</option>
                <option>Under $100/mo</option>
                <option>$100-150/mo</option>
                <option>$150-200/mo</option>
                <option>$200+/mo</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium">
                Search
              </button>
            </div>
          </div>
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
            {mapMarkers.length === 0 && mockGyms.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  Some gyms don't have location data and aren't shown on the
                  map.
                </p>
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {mockGyms.map((gym) => (
              <Link
                key={gym.id}
                href={`/browse/gyms/${gym.id}`}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden hover:border-red-600 transition-all group"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-red-900 to-zinc-900 flex items-center justify-center">
                  <span className="text-6xl">🏛️</span>
                </div>

                <div className="p-6">
                  {/* Name & Location */}
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-600 transition">
                    {gym.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    {gym.address}, {gym.city}, {gym.state}
                  </p>

                  {/* Description */}
                  <p className="text-zinc-300 text-sm mb-4">
                    {gym.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gym.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300"
                      >
                        {amenity}
                      </span>
                    ))}
                    {gym.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400">
                        +{gym.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Pricing & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span>⭐</span>
                      <span className="font-medium text-white">
                        {gym.averageRating}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        ${gym.membershipFee}/mo
                      </div>
                      <div className="text-xs text-zinc-400">
                        ${gym.dropInFee} drop-in
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
