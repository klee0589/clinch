import { MuayThaiStyle, ExperienceLevel } from './types';

// Muay Thai style display names
export const MUAY_THAI_STYLE_LABELS: Record<MuayThaiStyle, string> = {
  [MuayThaiStyle.TRADITIONAL]: 'Traditional',
  [MuayThaiStyle.DUTCH]: 'Dutch Style',
  [MuayThaiStyle.GOLDEN_AGE]: 'Golden Age',
  [MuayThaiStyle.MODERN]: 'Modern',
  [MuayThaiStyle.FITNESS]: 'Fitness/Cardio',
};

// Experience level display names
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  [ExperienceLevel.BEGINNER]: 'Beginner',
  [ExperienceLevel.INTERMEDIATE]: 'Intermediate',
  [ExperienceLevel.ADVANCED]: 'Advanced',
  [ExperienceLevel.PROFESSIONAL]: 'Professional',
};

// Common gym amenities
export const COMMON_AMENITIES = [
  'Heavy Bags',
  'Speed Bags',
  'Boxing Ring',
  'Muay Thai Ring',
  'Changing Rooms',
  'Showers',
  'Parking',
  'Locker Rentals',
  'Pro Shop',
  'Strength Training Equipment',
  'Cardio Equipment',
  'Sauna',
  'Physical Therapy',
];

// Session durations (in minutes)
export const SESSION_DURATIONS = [30, 60, 90, 120];

// Currency options
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'THB', 'AUD', 'CAD'];

// Platform fee percentage (for marketplace)
export const PLATFORM_FEE_PERCENTAGE = 15;
