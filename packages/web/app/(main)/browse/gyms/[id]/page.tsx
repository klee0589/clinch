"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Map } from "@/components/map/Map";
import { geocodeLocation, getFallbackCoordinates } from "@/lib/geocode";

// Mock gym data
const mockGym = {
  id: "1",
  name: "LA Muay Thai Academy",
  description:
    "Premier training facility with authentic Thai equipment and professional coaching staff. We pride ourselves on maintaining the highest standards of Muay Thai tradition while providing modern training facilities. Our gym has produced multiple champions and welcomes students of all skill levels.",
  address: "123 Main St",
  city: "Los Angeles",
  state: "CA",
  zipCode: "90012",
  phoneNumber: "(555) 123-4567",
  website: "https://lamuaythai.com",
  amenities: [
    "Heavy Bags",
    "Speed Bags",
    "Muay Thai Ring",
    "Boxing Ring",
    "Showers",
    "Changing Rooms",
    "Parking",
    "Pro Shop",
    "Locker Rentals",
    "Strength Training Equipment",
  ],
  membershipFee: 150,
  dropInFee: 25,
  averageRating: 4.8,
  photos: [],
  trainers: [
    {
      id: "1",
      name: 'John "The Clincher" Smith',
      specialties: ["Traditional", "Golden Age"],
    },
    {
      id: "2",
      name: 'Sarah "Lightning" Chen',
      specialties: ["Dutch", "Modern"],
    },
  ],
};

const mockReviews = [
  {
    id: "1",
    rating: 5,
    comment:
      "Amazing gym with great equipment and atmosphere. The staff is very welcoming and professional.",
    reviewerName: "Alex M.",
    date: "1 week ago",
  },
  {
    id: "2",
    rating: 5,
    comment:
      "Best Muay Thai gym in LA! Great trainers and a supportive community.",
    reviewerName: "Jennifer R.",
    date: "3 weeks ago",
  },
  {
    id: "3",
    rating: 4,
    comment: "Excellent facility but can get crowded during peak hours.",
    reviewerName: "Tom B.",
    date: "1 month ago",
  },
];

const schedule = [
  { day: "Monday - Friday", time: "6:00 AM - 10:00 PM" },
  { day: "Saturday", time: "8:00 AM - 8:00 PM" },
  { day: "Sunday", time: "9:00 AM - 6:00 PM" },
];

export default function GymDetailPage() {
  const [mapMarker, setMapMarker] = useState<any>(null);

  // Geocode gym location for map
  useEffect(() => {
    async function geocodeGym() {
      if (!mockGym.city) return;

      // Try geocoding first
      let coords = await geocodeLocation(mockGym.city, mockGym.state, "USA");

      // Fallback to common city coordinates if geocoding fails
      if (!coords) {
        coords = getFallbackCoordinates(mockGym.city);
      }

      // If we have coordinates, create a marker
      if (coords) {
        setMapMarker({
          id: mockGym.id,
          longitude: coords.longitude,
          latitude: coords.latitude,
          title: mockGym.name,
          description: `${mockGym.city}, ${mockGym.state} • $${mockGym.membershipFee}/mo`,
          color: "#FF6B35",
        });
      }
    }

    geocodeGym();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/browse/gyms"
        className="inline-flex items-center text-zinc-400 hover:text-white transition mb-6"
      >
        ← Back to gyms
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="h-96 bg-gradient-to-br from-red-900 to-zinc-900 rounded-xl flex items-center justify-center">
            <span className="text-9xl">🏛️</span>
          </div>

          {/* Gym Header */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {mockGym.name}
                </h1>
                <p className="text-zinc-400 mb-3">
                  {mockGym.address}, {mockGym.city}, {mockGym.state}{" "}
                  {mockGym.zipCode}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>⭐</span>
                  <span className="font-medium text-white">
                    {mockGym.averageRating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={`tel:${mockGym.phoneNumber}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
              >
                📞 {mockGym.phoneNumber}
              </a>
              <a
                href={mockGym.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
              >
                🌐 Visit Website
              </a>
            </div>
          </div>

          {/* About */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-zinc-300 leading-relaxed">
              {mockGym.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {mockGym.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-zinc-300"
                >
                  <span className="text-green-500">✓</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Hours</h2>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between text-zinc-300"
                >
                  <span>{item.day}</span>
                  <span className="font-medium text-white">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trainers at this gym */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Trainers at this Gym
            </h2>
            <div className="space-y-4">
              {mockGym.trainers.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/browse/trainers/${trainer.id}`}
                  className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg hover:border hover:border-red-600 transition"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold">
                    {trainer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{trainer.name}</div>
                    <div className="text-zinc-400 text-sm">
                      {trainer.specialties.join(", ")}
                    </div>
                  </div>
                  <span className="text-zinc-500">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Location Map */}
          {mapMarker && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
              <Map
                markers={[mapMarker]}
                center={[mapMarker.longitude, mapMarker.latitude]}
                height="400px"
                zoom={14}
              />
            </div>
          )}

          {/* Reviews */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-zinc-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <span className="text-zinc-400 text-sm">
                      by {review.reviewerName} · {review.date}
                    </span>
                  </div>
                  <p className="text-zinc-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 sticky top-6">
            <h3 className="text-xl font-bold text-white mb-4">Membership</h3>

            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-1">
                ${mockGym.membershipFee}
                <span className="text-lg text-zinc-400">/month</span>
              </div>
              <div className="text-sm text-zinc-400">Unlimited access</div>
            </div>

            <div className="mb-6 p-4 bg-zinc-900 rounded-lg">
              <div className="text-sm text-zinc-400 mb-1">Drop-in</div>
              <div className="text-xl font-bold text-white">
                ${mockGym.dropInFee}
              </div>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition mb-3">
              Join Now
            </button>

            <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold transition border border-zinc-700">
              Request Info
            </button>

            <div className="mt-6 pt-6 border-t border-zinc-700 text-center">
              <div className="text-sm text-zinc-400 mb-2">
                First class free!
              </div>
              <div className="text-xs text-zinc-500">
                No commitment required
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
