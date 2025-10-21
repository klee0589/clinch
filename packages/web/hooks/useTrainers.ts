"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { TrainerProfile } from "@clinch/shared";

export function useTrainers(filters?: {
  city?: string;
  state?: string;
  specialties?: string[];
  minRate?: number;
  maxRate?: number;
  availableForOnline?: boolean;
  minRating?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainers", filters],
    queryFn: async () => {
      const response = await apiClient.searchTrainers(filters);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // Data stays fresh for 2 minutes
  });

  return {
    trainers: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
}

export function useTrainer(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const response = await apiClient.getTrainer(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // Individual trainer data stays fresh for 5 minutes
  });

  return {
    trainer: data || null,
    loading: isLoading,
    error: error?.message || null,
  };
}
