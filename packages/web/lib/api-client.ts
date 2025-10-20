import type {
  User,
  TrainerProfile,
  GymProfile,
  TraineeProfile,
  Session,
  Message,
  Review,
} from '@clinch/shared';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  details?: string;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          details: data.details,
        };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Users
  async getCurrentUser() {
    return this.request<User & {
      trainerProfile?: TrainerProfile;
      gymProfile?: GymProfile;
      traineeProfile?: TraineeProfile;
    }>('/users');
  }

  async createUser(userData: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    imageUrl?: string;
  }) {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Trainers
  async searchTrainers(params?: {
    city?: string;
    state?: string;
    specialties?: string[];
    minRate?: number;
    maxRate?: number;
    availableForOnline?: boolean;
    minRating?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.state) searchParams.set('state', params.state);
    if (params?.specialties) searchParams.set('specialties', params.specialties.join(','));
    if (params?.minRate !== undefined) searchParams.set('minRate', params.minRate.toString());
    if (params?.maxRate !== undefined) searchParams.set('maxRate', params.maxRate.toString());
    if (params?.availableForOnline !== undefined) searchParams.set('availableForOnline', params.availableForOnline.toString());
    if (params?.minRating !== undefined) searchParams.set('minRating', params.minRating.toString());

    const query = searchParams.toString();
    // Use Supabase endpoint instead of Prisma
    return this.request<TrainerProfile[]>(`/trainers-supabase${query ? `?${query}` : ''}`);
  }

  async getTrainer(id: string) {
    return this.request<TrainerProfile>(`/trainers/${id}`);
  }

  async updateTrainer(id: string, data: Partial<TrainerProfile>) {
    return this.request<TrainerProfile>(`/trainers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Gyms
  async searchGyms(params?: {
    city?: string;
    state?: string;
    amenities?: string[];
    minRating?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.state) searchParams.set('state', params.state);
    if (params?.amenities) searchParams.set('amenities', params.amenities.join(','));
    if (params?.minRating !== undefined) searchParams.set('minRating', params.minRating.toString());

    const query = searchParams.toString();
    // Use Supabase endpoint instead of Prisma
    return this.request<GymProfile[]>(`/gyms-supabase${query ? `?${query}` : ''}`);
  }

  async getGym(id: string) {
    return this.request<GymProfile>(`/gyms/${id}`);
  }

  async updateGym(id: string, data: Partial<GymProfile>) {
    return this.request<GymProfile>(`/gyms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Sessions
  async createSession(sessionData: {
    trainerId: string;
    traineeId: string;
    scheduledAt: Date | string;
    duration: number;
    price: number;
    currency?: string;
    location?: string;
    isOnline?: boolean;
    notes?: string;
  }) {
    // Use Supabase endpoint instead of Prisma
    return this.request<Session>('/sessions-supabase', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getSessions(status?: string) {
    const query = status ? `?status=${status}` : '';
    // Use Supabase endpoint instead of Prisma
    return this.request<Session[]>(`/sessions-supabase${query}`);
  }

  async getSession(id: string) {
    return this.request<Session>(`/sessions/${id}`);
  }

  async updateSession(id: string, data: Partial<Session>) {
    return this.request<Session>(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSession(id: string) {
    return this.request<{ success: boolean }>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Profiles
  async createTrainerProfile(data: any) {
    return this.request<TrainerProfile>('/profiles/trainer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createTraineeProfile(data: any) {
    return this.request<TraineeProfile>('/profiles/trainee', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createGymProfile(data: any) {
    return this.request<GymProfile>('/profiles/gym', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
