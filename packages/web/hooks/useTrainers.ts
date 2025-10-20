'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { TrainerProfile } from '@clinch/shared';

export function useTrainers(filters?: {
  city?: string;
  state?: string;
  specialties?: string[];
  minRate?: number;
  maxRate?: number;
  availableForOnline?: boolean;
  minRating?: number;
}) {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrainers() {
      setLoading(true);
      setError(null);

      const response = await apiClient.searchTrainers(filters);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setTrainers(response.data);
      }

      setLoading(false);
    }

    fetchTrainers();
  }, [JSON.stringify(filters)]);

  return { trainers, loading, error };
}

export function useTrainer(id: string) {
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrainer() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const response = await apiClient.getTrainer(id);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setTrainer(response.data);
      }

      setLoading(false);
    }

    fetchTrainer();
  }, [id]);

  return { trainer, loading, error };
}
