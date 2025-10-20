import { z } from 'zod';
import { UserRole, SessionStatus, ExperienceLevel, MuayThaiStyle } from './types';

// User validations
export const userRoleSchema = z.nativeEnum(UserRole);

export const createUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: userRoleSchema,
  imageUrl: z.string().url().optional(),
});

// Trainer validations
export const createTrainerProfileSchema = z.object({
  userId: z.string(),
  bio: z.string().max(2000).optional(),
  specialties: z.array(z.nativeEnum(MuayThaiStyle)).min(1, 'Select at least one specialty'),
  experienceYears: z.number().int().min(0).max(50).optional(),
  certifications: z.array(z.string()),
  hourlyRate: z.number().positive().optional(),
  currency: z.string().default('USD'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  availableForOnline: z.boolean().default(false),
});

export const updateTrainerProfileSchema = createTrainerProfileSchema.partial().omit({ userId: true });

// Gym validations
export const createGymProfileSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Gym name is required').max(200),
  description: z.string().max(2000).optional(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()),
  photos: z.array(z.string().url()),
  membershipFee: z.number().positive().optional(),
  dropInFee: z.number().positive().optional(),
  currency: z.string().default('USD'),
});

export const updateGymProfileSchema = createGymProfileSchema.partial().omit({ userId: true });

// Trainee validations
export const createTraineeProfileSchema = z.object({
  userId: z.string(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  goals: z.string().max(1000).optional(),
  injuries: z.string().max(1000).optional(),
  preferredStyles: z.array(z.nativeEnum(MuayThaiStyle)),
  budget: z.number().positive().optional(),
  currency: z.string().default('USD'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const updateTraineeProfileSchema = createTraineeProfileSchema.partial().omit({ userId: true });

// Session validations
export const createSessionSchema = z.object({
  trainerId: z.string(),
  traineeId: z.string(),
  scheduledAt: z.date().min(new Date(), 'Session must be in the future'),
  duration: z.number().int().positive().max(300, 'Session cannot exceed 5 hours'),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
});

export const updateSessionSchema = z.object({
  scheduledAt: z.date().optional(),
  duration: z.number().int().positive().max(300).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  isOnline: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  paid: z.boolean().optional(),
});

// Message validations
export const createMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1, 'Message cannot be empty').max(5000),
});

// Review validations
export const createReviewSchema = z.object({
  trainerId: z.string().optional(),
  gymId: z.string().optional(),
  traineeId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
}).refine((data) => data.trainerId || data.gymId, {
  message: 'Review must be for either a trainer or a gym',
});

// Search/Filter schemas
export const trainerSearchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  specialties: z.array(z.nativeEnum(MuayThaiStyle)).optional(),
  minRate: z.number().optional(),
  maxRate: z.number().optional(),
  availableForOnline: z.boolean().optional(),
  minRating: z.number().min(1).max(5).optional(),
});

export const gymSearchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  minRating: z.number().min(1).max(5).optional(),
});
