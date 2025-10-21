"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const MUAY_THAI_STYLES = [
  "TRADITIONAL",
  "MODERN",
  "DUTCH",
  "GOLDEN_AGE",
  "FITNESS",
] as const;

export default function ProfilePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [trainerProfile, setTrainerProfile] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    specialties: [] as string[],
    experienceYears: 0,
    certifications: [] as string[],
    hourlyRate: 0,
    city: "",
    state: "",
    country: "",
    availableForOnline: false,
  });

  // Temporary input states
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        setLoading(true);

        // Get user data
        const userResponse = await fetch("/api/users/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);

          // Get trainer profile
          const trainerResponse = await fetch(
            `/api/trainers-supabase?userId=${userData.id}`,
          );
          if (trainerResponse.ok) {
            const trainers = await trainerResponse.json();
            if (trainers.length > 0) {
              const trainer = trainers[0];
              setTrainerProfile(trainer);
              setFormData({
                bio: trainer.bio || "",
                specialties: trainer.specialties || [],
                experienceYears: trainer.experienceYears || 0,
                certifications: trainer.certifications || [],
                hourlyRate: trainer.hourlyRate || 0,
                city: trainer.city || "",
                state: trainer.state || "",
                country: trainer.country || "",
                availableForOnline: trainer.availableForOnline || false,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trainerProfile) {
      setMessage({ type: "error", text: "No trainer profile found" });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(
        `/api/trainers-supabase/${trainerProfile.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!trainerProfile) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Trainer Profile Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You need to complete onboarding as a trainer first.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Trainer Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your information to appear like the other trainers
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bio */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About You
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Tell trainees about your experience, teaching style, and background..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Specialties
            </h2>
            <div className="flex flex-wrap gap-3">
              {MUAY_THAI_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleSpecialty(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.specialties.includes(style)
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {style.replace("_", " ")}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Rate */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Experience & Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceYears: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hourly Rate (USD)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Certifications
            </h2>
            <div className="space-y-3">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                    {cert}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addCertification())
                  }
                  placeholder="Add a certification..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <Button type="button" onClick={addCertification}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Location
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              📍 Add your location to appear on the map and help trainees find
              you
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="e.g., Los Angeles, Bangkok"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="e.g., CA, Bangkok"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="e.g., USA, Thailand"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Availability */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Online Sessions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make yourself available for online training sessions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.availableForOnline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableForOnline: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </main>
  );
}
