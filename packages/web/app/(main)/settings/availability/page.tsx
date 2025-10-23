"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const TIME_OPTIONS = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

export default function AvailabilityPage() {
  const { user } = useUser();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  // Fetch trainer profile and availability
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Get trainer profile
        const userResponse = await fetch("/api/users/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.trainerProfile?.id) {
            const tid = userData.trainerProfile.id;
            setTrainerId(tid);

            // Fetch availability
            const availResponse = await fetch(
              `/api/trainer-availability?trainerId=${tid}`,
            );
            if (availResponse.ok) {
              const availData = await availResponse.json();
              setAvailability(availData);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const addSlot = (dayOfWeek: number) => {
    setAvailability([
      ...availability,
      { dayOfWeek, startTime: "09:00:00", endTime: "17:00:00" },
    ]);
  };

  const removeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateSlot = (
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value + ":00" };
    setAvailability(updated);
  };

  const handleSave = async () => {
    if (!trainerId) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/trainer-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainerId, availability }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Availability saved successfully!",
        });
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to save availability",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save availability" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!trainerId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You need a trainer profile to manage availability.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group slots by day
  const slotsByDay = DAYS.map((day) => ({
    ...day,
    slots: availability
      .map((slot, index) => ({ ...slot, index }))
      .filter((slot) => slot.dayOfWeek === day.value),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Availability Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set your weekly schedule to let trainees know when you're available
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

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Weekly Schedule</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {slotsByDay.map((day) => (
            <div
              key={day.value}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {day.label}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addSlot(day.value)}
                >
                  + Add Time Slot
                </Button>
              </div>

              {day.slots.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No availability set
                </p>
              ) : (
                <div className="space-y-2">
                  {day.slots.map((slot) => (
                    <div key={slot.index} className="flex items-center gap-3">
                      <select
                        value={slot.startTime.slice(0, 5)}
                        onChange={(e) =>
                          updateSlot(slot.index, "startTime", e.target.value)
                        }
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">to</span>
                      <select
                        value={slot.endTime.slice(0, 5)}
                        onChange={(e) =>
                          updateSlot(slot.index, "endTime", e.target.value)
                        }
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSlot(slot.index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 flex gap-3">
            <Button onClick={handleSave} isLoading={saving} disabled={saving}>
              Save Availability
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
