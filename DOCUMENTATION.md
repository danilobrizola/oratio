# Oratio - Technical Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Component Structure](#component-structure)
4. [Authentication System](#authentication-system)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [State Management](#state-management)
8. [Deployment Guidelines](#deployment-guidelines)
9. [Performance Considerations](#performance-considerations)
10. [Security Considerations](#security-considerations)

## Introduction

Oratio is a prayer community platform built with Next.js and Supabase, designed to provide a supportive environment for sharing and responding to prayer requests. This document provides detailed technical information about the implementation, architecture, and key components of the application.

## Architecture Overview

Oratio follows a modern web application architecture with the following key components:

### Frontend Architecture

- **Framework**: Next.js 14 with App Router
- **Rendering Strategy**: Hybrid (Server Components + Client Components)
- **Styling**: Tailwind CSS with custom components
- **Component Library**: Custom UI components built with Radix UI primitives
- **State Management**: React hooks and context for local state management

### Backend Architecture

- **Database**: PostgreSQL hosted on Supabase
- **Authentication**: Supabase Auth with NextAuth.js adapter
- **API**: Next.js API routes and Supabase's REST API
- **Storage**: Supabase Storage for user-uploaded media (if applicable)

### Infrastructure

- **Hosting**: Recommended deployment on Vercel
- **Environment Variables**: Configuration via `.env.local` and deployment platform
- **Monitoring**: (To be implemented)

## Component Structure

The application is structured around several key components:

### Core Pages

1. **Home Page** (`app/page.tsx`):
   - Entry point displaying prayer feed
   - Handles pagination and data fetching from Supabase
   - Conditionally renders welcome message or prayer form

2. **Prayer Detail Page** (`app/prayers/[id]/page.tsx`):
   - Displays full prayer request details
   - Shows comments and allows new comment submission
   - Displays prayer response statistics

3. **Authentication Pages** (`app/auth/*`):
   - Login, registration, and password reset flows
   - Integration with Supabase Auth

### Key Components

1. **PrayerList Component** (`app/components/PrayerList.tsx`):
   - Renders a list of prayer requests
   - Conditionally renders empty state
   - Handles anonymous vs. public prayer display logic

2. **NewPrayerForm Component** (`app/components/NewPrayerForm.tsx`):
   - Form for submitting new prayer requests
   - Validation and error handling
   - Toggle for anonymous submission

3. **PrayerItem Component** (`app/components/PrayerItem.tsx`):
   - Individual prayer card display
   - Manages prayer count, comment rendering
   - Handles prayer status indicators

4. **PrayButton Component** (`app/components/PrayButton.tsx`):
   - Button for users to indicate they've prayed
   - Manages state and interaction with prayer counts table
   - Shows prayer count statistics

## Authentication System

Oratio implements a comprehensive authentication system using Supabase Auth with a custom adapter for NextAuth.js:

### Authentication Flow

1. **Registration**:
   - Email/password registration via Supabase Auth
   - User data stored in Supabase `users` table
   - Custom fields synchronized via middleware

2. **Login**:
   - Email/password and OAuth provider support
   - Session management via Supabase Auth
   - Session tokens stored in cookies

3. **Session Management**:
   - `useSupabaseAuth` hook manages authentication state
   - Next.js middleware validates sessions on protected routes
   - Automatic token refresh handling

### Auth Components

1. **Supabase Adapter** (`lib/supabase-adapter.ts`):
   - Custom adapter implementation for NextAuth.js
   - Manages CRUD operations for users, sessions, and accounts
   - Handles verification tokens and OAuth connections

2. **Authentication Hook** (`lib/hooks/useSupabaseAuth.ts`):
   - Custom React hook for accessing authentication state
   - Provides user information, loading state, and auth methods
   - Synchronizes user data between auth and database

3. **Middleware** (`middleware.ts`):
   - Server-side authentication validation
   - Cookie management for auth sessions
   - Protects routes requiring authentication

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Prayers Table
```sql
CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  prayer_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  status_message TEXT
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prayer_id UUID REFERENCES prayers(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Prayer Counts Table
```sql
CREATE TABLE prayer_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prayer_id UUID REFERENCES prayers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prayer_id, user_id)
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token TEXT NOT NULL UNIQUE
);
```

### Verification Tokens Table
```sql
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(identifier, token)
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);
```

## API Reference

### Prayer API Endpoints

#### GET /api/prayers
- **Description**: Fetch prayer requests with pagination
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**: JSON array of prayer objects with author and comment information

#### POST /api/prayers
- **Description**: Create a new prayer request
- **Auth**: Required
- **Request Body**:
  - `title`: Prayer request title
  - `content`: Prayer request content
  - `is_anonymous`: Boolean flag for anonymous submission
- **Response**: JSON object with created prayer

#### GET /api/prayers/[id]
- **Description**: Get a specific prayer request by ID
- **Response**: JSON object with prayer details, including author and comments

#### PATCH /api/prayers/[id]
- **Description**: Update a prayer request
- **Auth**: Required (must be author)
- **Request Body**: Prayer fields to update
- **Response**: JSON object with updated prayer

### Comment API Endpoints

#### POST /api/prayers/[id]/comments
- **Description**: Add a comment to a prayer request
- **Auth**: Required
- **Request Body**:
  - `content`: Comment text
- **Response**: JSON object with created comment

#### DELETE /api/comments/[id]
- **Description**: Delete a comment
- **Auth**: Required (must be author or admin)
- **Response**: Success message

### User API Endpoints

#### GET /api/user
- **Description**: Get current user information
- **Auth**: Required
- **Response**: JSON object with user details

#### POST /api/user/sync
- **Description**: Synchronize user data between auth and database
- **Auth**: Required
- **Request Body**: User data to synchronize
- **Response**: Success message

## State Management

Oratio uses a combination of React state hooks and custom hooks for state management:

### Authentication State
- Managed via `useSupabaseAuth` custom hook
- Provides user object, loading state, and auth methods
- Synchronizes with Supabase Auth

### Prayer Data
- Fetched in page components using `useEffect` and Supabase client
- Pagination state managed with React's `useState`
- Real-time updates (where applicable) using Supabase's subscription API

### Form State
- Managed with React `useState` hooks
- Form validation handled with custom validation logic
- Error states tracked and displayed to users

## Deployment Guidelines

### Environment Variables

Required environment variables for deployment:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Vercel Deployment Steps

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel project settings
3. Deploy using the Vercel dashboard or CLI

### Custom Server Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

3. Set up a reverse proxy (like Nginx) to expose the application

### Database Migrations

For Supabase database schema changes:

1. Use Supabase SQL Editor for schema changes
2. Export SQL definitions for version control
3. Apply changes across environments (dev, staging, production)

## Performance Considerations

### Optimizations Implemented

1. **Page Load Performance**:
   - Server-side rendering for initial content
   - Dynamic imports for non-critical components
   - Image optimization with Next.js Image component

2. **Database Query Optimization**:
   - Strategic use of indexes on frequently queried columns
   - Pagination to limit data transfer
   - Efficient joins for related data

3. **Client-Side Performance**:
   - Minimal re-renders using proper React patterns
   - Lazy loading for comments and additional content
   - Optimistic UI updates for better user experience

### Further Optimization Opportunities

1. **Caching Strategy**:
   - Implement SWR or React Query for data fetching and caching
   - Add Redis caching for frequent database queries

2. **Content Delivery**:
   - Set up CDN for static assets
   - Enable edge caching for API responses

3. **Bundle Size**:
   - Further code splitting for route-based chunks
   - Tree-shaking and removal of unused dependencies

## Security Considerations

### Authentication Security

1. **Session Management**:
   - Secure, HTTP-only cookies for auth tokens
   - Automatic token rotation and refresh
   - CSRF protection

2. **Password Security**:
   - Handled by Supabase Auth
   - Secure password reset flow
   - Rate limiting on auth endpoints

### Data Security

1. **Row Level Security (RLS)**:
   - Supabase RLS policies for database tables
   - Prevent unauthorized data access
   - Custom policies for specific data visibility rules

2. **Input Validation**:
   - Server-side validation for all data inputs
   - Sanitization to prevent XSS and injection attacks
   - Content validation rules for prayer requests and comments

3. **API Security**:
   - Authentication checks on protected endpoints
   - Authorization validation for user-specific operations
   - Rate limiting to prevent abuse

### Privacy Considerations

1. **Anonymous Prayers**:
   - Proper implementation of anonymous prayer requests
   - No leakage of author information when anonymous mode is selected

2. **Data Retention**:
   - Clear policies on data storage and retention
   - User data deletion capability

3. **Third-Party Services**:
   - Limited use of third-party services
   - Review of privacy implications for any external services
