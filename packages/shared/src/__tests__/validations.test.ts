import { describe, it, expect } from 'vitest';
import {
  createUserSchema,
  createTrainerProfileSchema,
  updateTrainerProfileSchema,
  createGymProfileSchema,
  updateGymProfileSchema,
  createTraineeProfileSchema,
  updateTraineeProfileSchema,
  createSessionSchema,
  updateSessionSchema,
  createMessageSchema,
  createReviewSchema,
  trainerSearchSchema,
  gymSearchSchema,
} from '../validations';
import { UserRole, MuayThaiStyle, ExperienceLevel, SessionStatus } from '../types';

describe('User Validations', () => {
  describe('createUserSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        clerkId: 'clerk_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.TRAINEE,
        imageUrl: 'https://example.com/image.jpg',
      };

      expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        clerkId: 'clerk_123',
        email: 'invalid-email',
        role: UserRole.TRAINEE,
      };

      expect(() => createUserSchema.parse(invalidUser)).toThrow();
    });

    it('should allow optional fields to be missing', () => {
      const minimalUser = {
        clerkId: 'clerk_123',
        email: 'test@example.com',
        role: UserRole.TRAINEE,
      };

      expect(() => createUserSchema.parse(minimalUser)).not.toThrow();
    });

    it('should reject invalid image URL', () => {
      const invalidUser = {
        clerkId: 'clerk_123',
        email: 'test@example.com',
        role: UserRole.TRAINEE,
        imageUrl: 'not-a-url',
      };

      expect(() => createUserSchema.parse(invalidUser)).toThrow();
    });
  });
});

describe('Trainer Profile Validations', () => {
  describe('createTrainerProfileSchema', () => {
    it('should validate a valid trainer profile', () => {
      const validProfile = {
        userId: 'user_123',
        bio: 'Experienced Muay Thai trainer',
        specialties: [MuayThaiStyle.TRADITIONAL, MuayThaiStyle.DUTCH],
        experienceYears: 10,
        certifications: ['IFMA Certified'],
        hourlyRate: 75,
        currency: 'USD',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        availableForOnline: true,
      };

      expect(() => createTrainerProfileSchema.parse(validProfile)).not.toThrow();
    });

    it('should require at least one specialty', () => {
      const invalidProfile = {
        userId: 'user_123',
        specialties: [],
        certifications: [],
      };

      expect(() => createTrainerProfileSchema.parse(invalidProfile)).toThrow();
    });

    it('should reject bio longer than 2000 characters', () => {
      const invalidProfile = {
        userId: 'user_123',
        bio: 'a'.repeat(2001),
        specialties: [MuayThaiStyle.TRADITIONAL],
        certifications: [],
      };

      expect(() => createTrainerProfileSchema.parse(invalidProfile)).toThrow();
    });

    it('should reject negative hourly rate', () => {
      const invalidProfile = {
        userId: 'user_123',
        specialties: [MuayThaiStyle.TRADITIONAL],
        hourlyRate: -10,
        certifications: [],
      };

      expect(() => createTrainerProfileSchema.parse(invalidProfile)).toThrow();
    });

    it('should reject experience years outside valid range', () => {
      const invalidProfile = {
        userId: 'user_123',
        specialties: [MuayThaiStyle.TRADITIONAL],
        experienceYears: 60,
        certifications: [],
      };

      expect(() => createTrainerProfileSchema.parse(invalidProfile)).toThrow();
    });
  });

  describe('updateTrainerProfileSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        hourlyRate: 100,
        availableForOnline: false,
      };

      expect(() => updateTrainerProfileSchema.parse(partialUpdate)).not.toThrow();
    });

    it('should not allow userId to be updated', () => {
      const result = updateTrainerProfileSchema.safeParse({ userId: 'new_user_123' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty('userId');
      }
    });
  });
});

describe('Gym Profile Validations', () => {
  describe('createGymProfileSchema', () => {
    it('should validate a valid gym profile', () => {
      const validGym = {
        userId: 'user_123',
        name: 'Elite Muay Thai Gym',
        description: 'Traditional Muay Thai training facility',
        phoneNumber: '+66-123-456-789',
        website: 'https://elitemuaythai.com',
        address: '123 Main St',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        zipCode: '10110',
        latitude: 13.7563,
        longitude: 100.5018,
        amenities: ['Showers', 'Locker Room', 'Ring'],
        photos: ['https://example.com/photo1.jpg'],
        membershipFee: 100,
        dropInFee: 20,
        currency: 'USD',
      };

      expect(() => createGymProfileSchema.parse(validGym)).not.toThrow();
    });

    it('should require name, address, city, state, and country', () => {
      const invalidGym = {
        userId: 'user_123',
        amenities: [],
        photos: [],
      };

      expect(() => createGymProfileSchema.parse(invalidGym)).toThrow();
    });

    it('should reject invalid website URL', () => {
      const invalidGym = {
        userId: 'user_123',
        name: 'Test Gym',
        website: 'not-a-url',
        address: '123 Main St',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        amenities: [],
        photos: [],
      };

      expect(() => createGymProfileSchema.parse(invalidGym)).toThrow();
    });

    it('should accept empty string for website', () => {
      const validGym = {
        userId: 'user_123',
        name: 'Test Gym',
        website: '',
        address: '123 Main St',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        amenities: [],
        photos: [],
      };

      expect(() => createGymProfileSchema.parse(validGym)).not.toThrow();
    });

    it('should reject invalid latitude/longitude', () => {
      const invalidGym = {
        userId: 'user_123',
        name: 'Test Gym',
        address: '123 Main St',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        latitude: 100, // Invalid
        amenities: [],
        photos: [],
      };

      expect(() => createGymProfileSchema.parse(invalidGym)).toThrow();
    });

    it('should reject negative fees', () => {
      const invalidGym = {
        userId: 'user_123',
        name: 'Test Gym',
        address: '123 Main St',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        membershipFee: -50,
        amenities: [],
        photos: [],
      };

      expect(() => createGymProfileSchema.parse(invalidGym)).toThrow();
    });
  });
});

describe('Trainee Profile Validations', () => {
  describe('createTraineeProfileSchema', () => {
    it('should validate a valid trainee profile', () => {
      const validProfile = {
        userId: 'user_123',
        experienceLevel: ExperienceLevel.BEGINNER,
        goals: 'Improve fitness and learn technique',
        injuries: 'Previous knee injury',
        preferredStyles: [MuayThaiStyle.FITNESS],
        budget: 50,
        currency: 'USD',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      };

      expect(() => createTraineeProfileSchema.parse(validProfile)).not.toThrow();
    });

    it('should allow minimal trainee profile', () => {
      const minimalProfile = {
        userId: 'user_123',
        preferredStyles: [],
      };

      expect(() => createTraineeProfileSchema.parse(minimalProfile)).not.toThrow();
    });

    it('should reject goals/injuries longer than 1000 characters', () => {
      const invalidProfile = {
        userId: 'user_123',
        goals: 'a'.repeat(1001),
        preferredStyles: [],
      };

      expect(() => createTraineeProfileSchema.parse(invalidProfile)).toThrow();
    });
  });
});

describe('Session Validations', () => {
  describe('createSessionSchema', () => {
    it('should validate a valid session', () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      const validSession = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        scheduledAt: futureDate,
        duration: 60,
        price: 75,
        currency: 'USD',
        location: '123 Main St',
        isOnline: false,
        notes: 'First session',
      };

      expect(() => createSessionSchema.parse(validSession)).not.toThrow();
    });

    it('should reject session scheduled in the past', () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      const invalidSession = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        scheduledAt: pastDate,
        duration: 60,
        price: 75,
      };

      expect(() => createSessionSchema.parse(invalidSession)).toThrow();
    });

    it('should reject duration exceeding 5 hours', () => {
      const futureDate = new Date(Date.now() + 86400000);
      const invalidSession = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        scheduledAt: futureDate,
        duration: 301, // More than 300 minutes
        price: 75,
      };

      expect(() => createSessionSchema.parse(invalidSession)).toThrow();
    });

    it('should reject negative price', () => {
      const futureDate = new Date(Date.now() + 86400000);
      const invalidSession = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        scheduledAt: futureDate,
        duration: 60,
        price: -10,
      };

      expect(() => createSessionSchema.parse(invalidSession)).toThrow();
    });
  });

  describe('updateSessionSchema', () => {
    it('should allow partial session updates', () => {
      const partialUpdate = {
        status: SessionStatus.CONFIRMED,
        paid: true,
      };

      expect(() => updateSessionSchema.parse(partialUpdate)).not.toThrow();
    });
  });
});

describe('Message Validations', () => {
  describe('createMessageSchema', () => {
    it('should validate a valid message', () => {
      const validMessage = {
        senderId: 'user_123',
        receiverId: 'user_456',
        content: 'Hello, I would like to schedule a session.',
      };

      expect(() => createMessageSchema.parse(validMessage)).not.toThrow();
    });

    it('should reject empty message', () => {
      const invalidMessage = {
        senderId: 'user_123',
        receiverId: 'user_456',
        content: '',
      };

      expect(() => createMessageSchema.parse(invalidMessage)).toThrow();
    });

    it('should reject message longer than 5000 characters', () => {
      const invalidMessage = {
        senderId: 'user_123',
        receiverId: 'user_456',
        content: 'a'.repeat(5001),
      };

      expect(() => createMessageSchema.parse(invalidMessage)).toThrow();
    });
  });
});

describe('Review Validations', () => {
  describe('createReviewSchema', () => {
    it('should validate a review for a trainer', () => {
      const validReview = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        rating: 5,
        comment: 'Excellent trainer!',
      };

      expect(() => createReviewSchema.parse(validReview)).not.toThrow();
    });

    it('should validate a review for a gym', () => {
      const validReview = {
        gymId: 'gym_123',
        traineeId: 'trainee_123',
        rating: 4,
        comment: 'Great facilities',
      };

      expect(() => createReviewSchema.parse(validReview)).not.toThrow();
    });

    it('should reject review without trainerId or gymId', () => {
      const invalidReview = {
        traineeId: 'trainee_123',
        rating: 5,
      };

      expect(() => createReviewSchema.parse(invalidReview)).toThrow();
    });

    it('should reject rating outside 1-5 range', () => {
      const invalidReview = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        rating: 6,
      };

      expect(() => createReviewSchema.parse(invalidReview)).toThrow();
    });

    it('should reject comment longer than 1000 characters', () => {
      const invalidReview = {
        trainerId: 'trainer_123',
        traineeId: 'trainee_123',
        rating: 5,
        comment: 'a'.repeat(1001),
      };

      expect(() => createReviewSchema.parse(invalidReview)).toThrow();
    });
  });
});

describe('Search Validations', () => {
  describe('trainerSearchSchema', () => {
    it('should validate trainer search with all fields', () => {
      const validSearch = {
        city: 'Bangkok',
        state: 'Bangkok',
        specialties: [MuayThaiStyle.TRADITIONAL],
        minRate: 50,
        maxRate: 100,
        availableForOnline: true,
        minRating: 4,
      };

      expect(() => trainerSearchSchema.parse(validSearch)).not.toThrow();
    });

    it('should allow empty search', () => {
      const emptySearch = {};
      expect(() => trainerSearchSchema.parse(emptySearch)).not.toThrow();
    });

    it('should reject invalid rating range', () => {
      const invalidSearch = {
        minRating: 6,
      };

      expect(() => trainerSearchSchema.parse(invalidSearch)).toThrow();
    });
  });

  describe('gymSearchSchema', () => {
    it('should validate gym search with all fields', () => {
      const validSearch = {
        city: 'Bangkok',
        state: 'Bangkok',
        amenities: ['Ring', 'Showers'],
        minRating: 4,
      };

      expect(() => gymSearchSchema.parse(validSearch)).not.toThrow();
    });

    it('should allow empty search', () => {
      const emptySearch = {};
      expect(() => gymSearchSchema.parse(emptySearch)).not.toThrow();
    });
  });
});
