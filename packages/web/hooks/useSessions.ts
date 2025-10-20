'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Session } from '@clinch/shared';

export function useSessions(status?: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.getSessions(status);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setSessions(response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [status]);

  return { sessions, loading, error, refetch: fetchSessions };
}

export function useSession(id: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const response = await apiClient.getSession(id);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSession(response.data);
      }

      setLoading(false);
    }

    fetchSession();
  }, [id]);

  return { session, loading, error };
}
