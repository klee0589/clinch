'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { apiClient } from '@/lib/api-client';

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

  const [formData, setFormData] = useState({
    scheduledAt: '',
    duration: '60',
    isOnline: false,
    location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sessionData = {
        trainerId,
        traineeId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        duration: parseInt(formData.duration),
        price: trainerRate * (parseInt(formData.duration) / 60),
        currency: 'USD',
        isOnline: formData.isOnline,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
      };

      const response = await apiClient.createSession(sessionData);

      if (response.error) {
        setError(response.error);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('Failed to create booking');
    } finally {
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

      {/* Date and Time */}
      <Input
        type="datetime-local"
        label="Session Date & Time"
        value={formData.scheduledAt}
        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
        required
        min={new Date().toISOString().slice(0, 16)}
      />

      {/* Duration */}
      <Select
        label="Duration"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        options={[
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' },
          { value: '90', label: '1.5 hours' },
          { value: '120', label: '2 hours' },
          { value: '180', label: '3 hours' },
        ]}
      />

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
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
        Your booking request will be sent to the trainer for confirmation. Payment will be processed after the trainer accepts.
      </p>
    </form>
  );
}
