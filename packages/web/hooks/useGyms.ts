'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { GymProfile } from '@clinch/shared';

export function useGyms(filters?: {
  city?: string;
  state?: string;
  amenities?: string[];
  minRating?: number;
}) {
  const [gyms, setGyms] = useState<GymProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGyms() {
      setLoading(true);
      setError(null);

      const response = await apiClient.searchGyms(filters);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setGyms(response.data);
      }

      setLoading(false);
    }

    fetchGyms();
  }, [JSON.stringify(filters)]);

  return { gyms, loading, error };
}

export function useGym(id: string) {
  const [gym, setGym] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGym() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const response = await apiClient.getGym(id);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setGym(response.data);
      }

      setLoading(false);
    }

    fetchGym();
  }, [id]);

  return { gym, loading, error };
}
