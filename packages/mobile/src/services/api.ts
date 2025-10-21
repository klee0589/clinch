import axios, { AxiosInstance } from "axios";
import { config } from "../../config";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get("/users/me");
    return response.data;
  }

  async completeOnboarding(data: {
    role: "TRAINEE" | "TRAINER" | "GYM_OWNER";
  }) {
    const response = await this.client.post("/users/onboarding", data);
    return response.data;
  }

  // Trainer endpoints
  async getTrainers(params?: {
    city?: string;
    state?: string;
    minRate?: number;
    maxRate?: number;
    availableForOnline?: boolean;
    minRating?: number;
  }) {
    const response = await this.client.get("/trainers-supabase", { params });
    return response.data;
  }

  async getTrainerById(id: string) {
    const response = await this.client.get(`/trainers-supabase/${id}`);
    return response.data;
  }

  async updateTrainerProfile(id: string, data: any) {
    const response = await this.client.patch(`/trainers-supabase/${id}`, data);
    return response.data;
  }

  // Gym endpoints
  async getGyms(params?: {
    city?: string;
    state?: string;
    amenities?: string;
    minRating?: number;
  }) {
    const response = await this.client.get("/gyms-supabase", { params });
    return response.data;
  }

  // Session endpoints
  async getSessions(params?: {
    status?: string;
    view?: "trainee" | "trainer";
  }) {
    const response = await this.client.get("/sessions-supabase", { params });
    return response.data;
  }

  async createSession(data: {
    trainerId: string;
    traineeId: string;
    scheduledAt: string;
    duration: number;
    price: number;
    location?: string;
    isOnline: boolean;
    notes?: string;
  }) {
    const response = await this.client.post("/sessions-supabase", data);
    return response.data;
  }

  async updateSessionStatus(id: string, status: string) {
    const response = await this.client.patch(`/sessions-supabase/${id}`, {
      status,
    });
    return response.data;
  }

  // Trainee profile endpoints
  async getTraineeProfile(userId: string) {
    const response = await this.client.get(`/trainee-profile?userId=${userId}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
