# Clinch API Documentation

This document describes all API endpoints available in the Clinch platform.

## Authentication

All API endpoints require authentication using Clerk. Include your session token in requests.

## Base URL

```
http://localhost:3000/api (development)
```

## Endpoints

### Users

#### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "clerkId": "string",
  "email": "string",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "role": "TRAINEE" | "TRAINER" | "GYM_OWNER" | "ADMIN",
  "imageUrl": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "clerkId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "TRAINEE",
  "imageUrl": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Current User
```http
GET /api/users
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "clerkId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "TRAINEE",
  "imageUrl": "string",
  "trainerProfile": { ... },
  "gymProfile": { ... },
  "traineeProfile": { ... },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Trainers

#### Search Trainers
```http
GET /api/trainers?city=Bangkok&minRate=50&maxRate=150&specialties=TRADITIONAL&availableForOnline=true&minRating=4
```

**Query Parameters:**
- `city` (optional): Filter by city name
- `state` (optional): Filter by state
- `specialties` (optional): Comma-separated list of styles (TRADITIONAL, DUTCH, GOLDEN_AGE, MODERN, FITNESS)
- `minRate` (optional): Minimum hourly rate
- `maxRate` (optional): Maximum hourly rate
- `availableForOnline` (optional): Filter for online availability (true/false)
- `minRating` (optional): Minimum average rating (1-5)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "userId": "string",
    "bio": "string",
    "specialties": ["TRADITIONAL", "DUTCH"],
    "experienceYears": 10,
    "certifications": ["IFMA Certified"],
    "hourlyRate": 100,
    "currency": "USD",
    "city": "Bangkok",
    "state": "Bangkok",
    "country": "Thailand",
    "availableForOnline": true,
    "totalSessions": 500,
    "averageRating": 4.8,
    "user": {
      "id": "string",
      "firstName": "John",
      "lastName": "Doe",
      "imageUrl": "https://...",
      "email": "john@example.com"
    },
    "gyms": [
      {
        "gym": {
          "name": "Elite Muay Thai Gym",
          "city": "Bangkok",
          "state": "Bangkok",
          "country": "Thailand"
        }
      }
    ]
  }
]
```

#### Get Trainer Details
```http
GET /api/trainers/:id
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "userId": "string",
  "bio": "string",
  "specialties": ["TRADITIONAL", "DUTCH"],
  "experienceYears": 10,
  "certifications": ["IFMA Certified"],
  "hourlyRate": 100,
  "currency": "USD",
  "city": "Bangkok",
  "state": "Bangkok",
  "country": "Thailand",
  "availableForOnline": true,
  "totalSessions": 500,
  "averageRating": 4.8,
  "user": { ... },
  "gyms": [ ... ],
  "reviews": [
    {
      "id": "string",
      "rating": 5,
      "comment": "Excellent trainer!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "trainee": {
        "user": {
          "firstName": "Jane",
          "lastName": "Smith",
          "imageUrl": "https://..."
        }
      }
    }
  ]
}
```

#### Update Trainer Profile
```http
PATCH /api/trainers/:id
```

**Request Body:**
```json
{
  "bio": "string (optional)",
  "specialties": ["TRADITIONAL", "DUTCH"] (optional),
  "experienceYears": 10 (optional),
  "certifications": ["string"] (optional),
  "hourlyRate": 100 (optional),
  "city": "string (optional)",
  "state": "string (optional)",
  "country": "string (optional)",
  "availableForOnline": true (optional)
}
```

**Response:** `200 OK`

---

### Gyms

#### Search Gyms
```http
GET /api/gyms?city=Bangkok&amenities=Ring,Showers&minRating=4
```

**Query Parameters:**
- `city` (optional): Filter by city name
- `state` (optional): Filter by state
- `amenities` (optional): Comma-separated list of amenities
- `minRating` (optional): Minimum average rating (1-5)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "name": "Elite Muay Thai Gym",
    "description": "World-class facility...",
    "phoneNumber": "+66-2-123-4567",
    "website": "https://elitemuaythai.com",
    "address": "123 Main St",
    "city": "Bangkok",
    "state": "Bangkok",
    "country": "Thailand",
    "zipCode": "10110",
    "latitude": 13.7563,
    "longitude": 100.5018,
    "amenities": ["Ring", "Showers", "Locker Room"],
    "photos": ["https://..."],
    "membershipFee": 100,
    "dropInFee": 20,
    "currency": "USD",
    "averageRating": 4.8,
    "trainers": [ ... ]
  }
]
```

#### Get Gym Details
```http
GET /api/gyms/:id
```

**Response:** `200 OK` (includes trainers and reviews)

#### Update Gym Profile
```http
PATCH /api/gyms/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "description": "string",
  "phoneNumber": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zipCode": "string",
  "amenities": ["string"],
  "photos": ["string"],
  "membershipFee": 100,
  "dropInFee": 20
}
```

**Response:** `200 OK`

---

### Sessions

#### Create Session
```http
POST /api/sessions
```

**Request Body:**
```json
{
  "trainerId": "string",
  "traineeId": "string",
  "scheduledAt": "2024-12-31T14:00:00.000Z",
  "duration": 60,
  "price": 100,
  "currency": "USD",
  "location": "string (optional)",
  "isOnline": false,
  "notes": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "trainerId": "string",
  "traineeId": "string",
  "scheduledAt": "2024-12-31T14:00:00.000Z",
  "duration": 60,
  "status": "PENDING",
  "price": 100,
  "currency": "USD",
  "paid": false,
  "location": "string",
  "isOnline": false,
  "notes": "string",
  "trainer": { ... },
  "trainee": { ... }
}
```

#### Get User's Sessions
```http
GET /api/sessions?status=CONFIRMED
```

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "trainerId": "string",
    "traineeId": "string",
    "scheduledAt": "2024-12-31T14:00:00.000Z",
    "duration": 60,
    "status": "CONFIRMED",
    "price": 100,
    "paid": true,
    "trainer": {
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "imageUrl": "https://..."
      }
    },
    "trainee": {
      "user": {
        "firstName": "Jane",
        "lastName": "Smith",
        "imageUrl": "https://..."
      }
    }
  }
]
```

#### Get Session Details
```http
GET /api/sessions/:id
```

**Response:** `200 OK`

#### Update Session
```http
PATCH /api/sessions/:id
```

**Request Body:** (all fields optional)
```json
{
  "scheduledAt": "2024-12-31T14:00:00.000Z",
  "duration": 90,
  "status": "CONFIRMED",
  "price": 150,
  "location": "string",
  "isOnline": true,
  "notes": "string",
  "paid": true
}
```

**Response:** `200 OK`

#### Delete Session
```http
DELETE /api/sessions/:id
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

### Profiles

#### Create Trainer Profile
```http
POST /api/profiles/trainer
```

**Request Body:**
```json
{
  "bio": "string (optional)",
  "specialties": ["TRADITIONAL", "DUTCH"],
  "experienceYears": 10 (optional),
  "certifications": ["string"],
  "hourlyRate": 100 (optional),
  "currency": "USD",
  "city": "string (optional)",
  "state": "string (optional)",
  "country": "string (optional)",
  "availableForOnline": false
}
```

**Response:** `201 Created`

#### Create Trainee Profile
```http
POST /api/profiles/trainee
```

**Request Body:**
```json
{
  "experienceLevel": "BEGINNER" (optional),
  "goals": "string (optional)",
  "injuries": "string (optional)",
  "preferredStyles": ["FITNESS", "TRADITIONAL"],
  "budget": 75 (optional),
  "currency": "USD",
  "city": "string (optional)",
  "state": "string (optional)",
  "country": "string (optional)"
}
```

**Response:** `201 Created`

#### Create Gym Profile
```http
POST /api/profiles/gym
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "phoneNumber": "string (optional)",
  "website": "string (optional)",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zipCode": "string (optional)",
  "latitude": 13.7563 (optional),
  "longitude": 100.5018 (optional),
  "amenities": ["string"],
  "photos": ["string"],
  "membershipFee": 100 (optional),
  "dropInFee": 20 (optional),
  "currency": "USD"
}
```

**Response:** `201 Created`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: You can only access your own data"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Data Types

### UserRole
- `TRAINEE`: Regular user looking for training
- `TRAINER`: Muay Thai trainer
- `GYM_OWNER`: Owner of a Muay Thai gym
- `ADMIN`: Platform administrator

### MuayThaiStyle
- `TRADITIONAL`: Traditional Thai style
- `DUTCH`: Dutch kickboxing style
- `GOLDEN_AGE`: Golden age style
- `MODERN`: Modern competitive style
- `FITNESS`: Fitness-focused training

### ExperienceLevel
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`
- `PROFESSIONAL`

### SessionStatus
- `PENDING`: Session requested, awaiting confirmation
- `CONFIRMED`: Session confirmed by both parties
- `COMPLETED`: Session has been completed
- `CANCELLED`: Session was cancelled
