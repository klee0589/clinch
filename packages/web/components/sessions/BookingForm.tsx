"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiClient } from "@/lib/api-client";

interface BookingFormProps {
  trainerId: string;
  traineeId: string;
  trainerRate?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({
  trainerId,
  traineeId,
  trainerRate = 0,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    scheduledAt: "",
    duration: "60",
    isOnline: false,
    location: "",
    notes: "",
  });

  // Fetch available slots when date or duration changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate || !trainerId) return;

      setLoadingSlots(true);
      try {
        const response = await fetch(
          `/api/trainer-availability/slots?trainerId=${trainerId}&date=${selectedDate}&duration=${formData.duration}`,
        );
        if (response.ok) {
          const slots = await response.json();
          setAvailableSlots(slots);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedDate, formData.duration, trainerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the session in our database
      const sessionData = {
        trainerId,
        traineeId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        duration: parseInt(formData.duration),
        price: trainerRate * (parseInt(formData.duration) / 60),
        currency: "USD",
        isOnline: formData.isOnline,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
      };

      const response = await apiClient.createSession(sessionData);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (!response.data) {
        setError("Failed to create session");
        setLoading(false);
        return;
      }

      // Step 2: Create Stripe checkout session and redirect to payment
      const checkoutResponse = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: response.data.id,
          }),
        },
      );

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.error) {
        setError(checkoutData.error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        setError("Failed to create payment session");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to create booking");
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const hours = parseInt(formData.duration) / 60;
    return (trainerRate * hours).toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Book a Session
        </h3>
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Date Picker */}
      <Input
        type="date"
        label="Session Date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setFormData({ ...formData, scheduledAt: "" });
        }}
        required
        min={new Date().toISOString().slice(0, 10)}
      />

      {/* Duration */}
      <Select
        label="Duration"
        value={formData.duration}
        onChange={(e) => {
          setFormData({
            ...formData,
            duration: e.target.value,
            scheduledAt: "",
          });
        }}
        options={[
          { value: "30", label: "30 minutes" },
          { value: "60", label: "1 hour" },
          { value: "90", label: "1.5 hours" },
          { value: "120", label: "2 hours" },
          { value: "180", label: "3 hours" },
        ]}
      />

      {/* Available Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Time Slots
          </label>
          {loadingSlots ? (
            <p className="text-sm text-gray-500">Loading available times...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-gray-500">
              No available slots for this date. Please choose another date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const slotTime = new Date(slot);
                const timeString = slotTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const isSelected =
                  formData.scheduledAt === slotTime.toISOString();

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        scheduledAt: slotTime.toISOString(),
                      })
                    }
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500"
                    }`}
                  >
                    {timeString}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Session Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Session Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!formData.isOnline}
              onChange={() => setFormData({ ...formData, isOnline: false })}
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              In-Person
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={formData.isOnline}
              onChange={() => setFormData({ ...formData, isOnline: true })}
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Online
            </span>
          </label>
        </div>
      </div>

      {/* Location (only for in-person) */}
      {!formData.isOnline && (
        <Input
          label="Location"
          placeholder="Gym name or address"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          helperText="Where would you like to meet?"
        />
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any specific goals or requests for this session?"
          rows={3}
          className="
            w-full px-3 py-2
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            rounded-lg
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-orange-500
            resize-none
          "
        />
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rate: ${trainerRate}/hour
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Duration: {parseInt(formData.duration)} min
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
            ${calculateTotal()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
          className="flex-1"
        >
          Request Booking
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        You'll be redirected to Stripe to complete payment. Your session will be
        automatically confirmed once payment is successful.
      </p>
    </form>
  );
}
