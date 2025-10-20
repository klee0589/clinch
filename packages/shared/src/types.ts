// User roles
export enum UserRole {
  TRAINEE = 'TRAINEE',
  TRAINER = 'TRAINER',
  GYM_OWNER = 'GYM_OWNER',
  ADMIN = 'ADMIN',
}

// Session status
export enum SessionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Experience levels
export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  PROFESSIONAL = 'PROFESSIONAL',
}

// Muay Thai styles
export enum MuayThaiStyle {
  TRADITIONAL = 'TRADITIONAL',
  DUTCH = 'DUTCH',
  GOLDEN_AGE = 'GOLDEN_AGE',
  MODERN = 'MODERN',
  FITNESS = 'FITNESS',
}

// User types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  bio?: string;
  specialties: MuayThaiStyle[];
  experienceYears?: number;
  certifications: string[];
  hourlyRate?: number;
  currency: string;
  city?: string;
  state?: string;
  country?: string;
  availableForOnline: boolean;
  totalSessions: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GymProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  photos: string[];
  membershipFee?: number;
  dropInFee?: number;
  currency: string;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TraineeProfile {
  id: string;
  userId: string;
  experienceLevel?: ExperienceLevel;
  goals?: string;
  injuries?: string;
  preferredStyles: MuayThaiStyle[];
  budget?: number;
  currency: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  trainerId: string;
  traineeId: string;
  scheduledAt: Date;
  duration: number;
  status: SessionStatus;
  price: number;
  currency: string;
  paid: boolean;
  location?: string;
  isOnline: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  trainerId?: string;
  gymId?: string;
  traineeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
