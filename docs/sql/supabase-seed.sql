-- Clinch Sample Data for Supabase
-- Run this AFTER running supabase-schema.sql
-- This creates sample trainers, gyms, trainees, and sessions

-- Clear existing data (optional - comment out if you want to keep existing data)
DELETE FROM "Review";
DELETE FROM "Message";
DELETE FROM "Session";
DELETE FROM "TrainerGym";
DELETE FROM "TraineeProfile";
DELETE FROM "TrainerProfile";
DELETE FROM "GymProfile";
DELETE FROM "User";

-- Create Users
INSERT INTO "User" ("id", "clerkId", "email", "firstName", "lastName", "role", "imageUrl", "createdAt", "updatedAt") VALUES
('user_trainer_1', 'trainer_clerk_1', 'samart@muaythai.com', 'Samart', 'Payakaroon', 'TRAINER', 'https://example.com/samart.jpg', NOW(), NOW()),
('user_trainer_2', 'trainer_clerk_2', 'buakaw@muaythai.com', 'Buakaw', 'Banchamek', 'TRAINER', 'https://example.com/buakaw.jpg', NOW(), NOW()),
('user_trainer_3', 'trainer_clerk_3', 'ramon@dekkers.com', 'Ramon', 'Dekkers', 'TRAINER', 'https://example.com/ramon.jpg', NOW(), NOW()),
('user_gym_1', 'gym_clerk_1', 'owner@yokkao.com', 'Yokkao', 'Gym', 'GYM_OWNER', NULL, NOW(), NOW()),
('user_gym_2', 'gym_clerk_2', 'owner@fairtex.com', 'Fairtex', 'Training', 'GYM_OWNER', NULL, NOW(), NOW()),
('user_trainee_1', 'trainee_clerk_1', 'john@example.com', 'John', 'Smith', 'TRAINEE', NULL, NOW(), NOW()),
('user_trainee_2', 'trainee_clerk_2', 'sarah@example.com', 'Sarah', 'Johnson', 'TRAINEE', NULL, NOW(), NOW()),
('user_trainee_3', 'trainee_clerk_3', 'mike@example.com', 'Mike', 'Chen', 'TRAINEE', NULL, NOW(), NOW());

-- Create Trainer Profiles
INSERT INTO "TrainerProfile" ("id", "userId", "bio", "specialties", "experienceYears", "certifications", "hourlyRate", "currency", "city", "state", "country", "availableForOnline", "totalSessions", "averageRating", "createdAt", "updatedAt") VALUES
('trainer_1', 'user_trainer_1', 'Legendary Thai boxer and trainer with over 30 years of experience. Known for technical precision and the "femur" style of fighting.', ARRAY['TRADITIONAL', 'GOLDEN_AGE']::"MuayThaiStyle"[], 30, ARRAY['IFMA Master Trainer', 'WMC Certified'], 150, 'USD', 'Bangkok', 'Bangkok', 'Thailand', true, 500, 4.9, NOW(), NOW()),
('trainer_2', 'user_trainer_2', 'Professional Muay Thai champion specializing in modern competitive techniques and conditioning.', ARRAY['MODERN', 'TRADITIONAL']::"MuayThaiStyle"[], 25, ARRAY['IFMA Certified', 'K-1 Champion'], 200, 'USD', 'Pattaya', 'Chonburi', 'Thailand', true, 750, 5.0, NOW(), NOW()),
('trainer_3', 'user_trainer_3', 'Dutch kickboxing legend who brought Dutch-style Muay Thai to the world. Expert in aggressive, combination-based fighting.', ARRAY['DUTCH', 'MODERN']::"MuayThaiStyle"[], 20, ARRAY['Dutch Kickboxing Federation Certified'], 175, 'USD', 'Amsterdam', 'North Holland', 'Netherlands', true, 600, 4.8, NOW(), NOW());

-- Create Gym Profiles
INSERT INTO "GymProfile" ("id", "userId", "name", "description", "phoneNumber", "website", "address", "city", "state", "country", "zipCode", "latitude", "longitude", "amenities", "photos", "membershipFee", "dropInFee", "currency", "averageRating", "createdAt", "updatedAt") VALUES
('gym_1', 'user_gym_1', 'Yokkao Training Center Bangkok', 'World-class Muay Thai training facility with traditional Thai atmosphere and modern amenities.', '+66-2-123-4567', 'https://yokkao.com', '123 Sukhumvit Road', 'Bangkok', 'Bangkok', 'Thailand', '10110', 13.7563, 100.5018, ARRAY['Traditional Ring', 'Western Boxing Ring', 'Showers', 'Locker Room', 'Sauna', 'Pro Shop', 'Cafe'], ARRAY['https://example.com/yokkao1.jpg', 'https://example.com/yokkao2.jpg'], 150, 30, 'USD', 4.8, NOW(), NOW()),
('gym_2', 'user_gym_2', 'Fairtex Muay Thai Training Center', 'Premier training facility with professional fighters and world-class coaches. Perfect for serious practitioners.', '+66-38-123-456', 'https://fairtex.com', '456 Beach Road', 'Pattaya', 'Chonburi', 'Thailand', '20150', 12.9236, 100.8825, ARRAY['Multiple Rings', 'Strength & Conditioning Room', 'Swimming Pool', 'Accommodation', 'Restaurant', 'Physical Therapy'], ARRAY['https://example.com/fairtex1.jpg', 'https://example.com/fairtex2.jpg', 'https://example.com/fairtex3.jpg'], 200, 40, 'USD', 4.9, NOW(), NOW());

-- Link Trainers to Gyms
INSERT INTO "TrainerGym" ("id", "trainerId", "gymId", "createdAt") VALUES
('tg_1', 'trainer_1', 'gym_1', NOW()),
('tg_2', 'trainer_2', 'gym_2', NOW());

-- Create Trainee Profiles
INSERT INTO "TraineeProfile" ("id", "userId", "experienceLevel", "goals", "injuries", "preferredStyles", "budget", "currency", "city", "state", "country", "createdAt", "updatedAt") VALUES
('trainee_1', 'user_trainee_1', 'BEGINNER', 'Learn the fundamentals of Muay Thai for fitness and self-defense', 'Previous shoulder injury (recovered)', ARRAY['FITNESS', 'TRADITIONAL']::"MuayThaiStyle"[], 75, 'USD', 'New York', 'NY', 'USA', NOW(), NOW()),
('trainee_2', 'user_trainee_2', 'INTERMEDIATE', 'Prepare for first amateur fight and improve clinch work', NULL, ARRAY['MODERN', 'DUTCH']::"MuayThaiStyle"[], 120, 'USD', 'Los Angeles', 'CA', 'USA', NOW(), NOW()),
('trainee_3', 'user_trainee_3', 'ADVANCED', 'Refine technique and strategy for upcoming professional bout', NULL, ARRAY['TRADITIONAL', 'GOLDEN_AGE']::"MuayThaiStyle"[], 200, 'USD', 'Bangkok', 'Bangkok', 'Thailand', NOW(), NOW());

-- Create Sessions
INSERT INTO "Session" ("id", "trainerId", "traineeId", "scheduledAt", "duration", "status", "price", "currency", "paid", "location", "isOnline", "notes", "createdAt", "updatedAt") VALUES
('session_1', 'trainer_1', 'trainee_1', NOW() + INTERVAL '7 days', 60, 'CONFIRMED', 150, 'USD', true, NULL, true, 'Focus on basic stance and footwork', NOW(), NOW()),
('session_2', 'trainer_2', 'trainee_2', NOW() + INTERVAL '14 days', 90, 'PENDING', 200, 'USD', false, 'Fairtex Muay Thai Training Center', false, 'Advanced clinch techniques and sparring', NOW(), NOW()),
('session_3', 'trainer_3', 'trainee_3', NOW() - INTERVAL '7 days', 120, 'COMPLETED', 175, 'USD', true, NULL, true, 'Private session focusing on Dutch combinations', NOW(), NOW());

-- Create Reviews
INSERT INTO "Review" ("id", "trainerId", "gymId", "traineeId", "rating", "comment", "createdAt", "updatedAt") VALUES
('review_1', 'trainer_3', NULL, 'trainee_3', 5, 'Incredible session! Ramon''s teaching style is clear and effective. Learned more in one session than I did in months of regular training.', NOW(), NOW()),
('review_2', 'trainer_1', NULL, 'trainee_1', 5, 'Samart is a legend and it shows. Very patient with beginners and provides excellent technical feedback.', NOW(), NOW()),
('review_3', NULL, 'gym_1', 'trainee_2', 5, 'Amazing facility with great atmosphere. The trainers are world-class and the equipment is top-notch.', NOW(), NOW()),
('review_4', NULL, 'gym_2', 'trainee_3', 5, 'Best Muay Thai gym I''ve ever trained at. Perfect for serious fighters looking to take their skills to the next level.', NOW(), NOW());

-- Create Messages
INSERT INTO "Message" ("id", "senderId", "receiverId", "content", "read", "createdAt") VALUES
('msg_1', 'user_trainee_1', 'user_trainer_1', 'Hi Samart, I''m interested in booking a session with you. Are you available next week?', true, NOW()),
('msg_2', 'user_trainer_1', 'user_trainee_1', 'Hello! Yes, I have availability next week. What days work best for you?', false, NOW()),
('msg_3', 'user_trainee_2', 'user_trainer_2', 'Looking forward to our session next week! Should I bring my own gear?', true, NOW()),
('msg_4', 'user_trainer_2', 'user_trainee_2', 'Great! Yes, please bring your gloves, shin guards, and hand wraps. See you then!', false, NOW());

-- Success message
SELECT
    'Sample data created successfully! ✅' as message,
    (SELECT COUNT(*) FROM "User") as users,
    (SELECT COUNT(*) FROM "TrainerProfile") as trainers,
    (SELECT COUNT(*) FROM "GymProfile") as gyms,
    (SELECT COUNT(*) FROM "TraineeProfile") as trainees,
    (SELECT COUNT(*) FROM "Session") as sessions,
    (SELECT COUNT(*) FROM "Review") as reviews,
    (SELECT COUNT(*) FROM "Message") as messages;
