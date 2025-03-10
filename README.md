# Oratio - Prayer Platform 🙏

> "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace." - Numbers 6:24-26

Oratio is a modern web application designed to create a supportive prayer community where users can share prayer requests, pray for others, and engage in spiritual support.

*All glory goes to the Lord.*

## Features

- **🙏 Prayer Requests**: Users can create public or anonymous prayer requests
- **💖 Prayer Support**: Users can indicate they've prayed for a request and see others who have prayed
- **💬 Comments**: Community members can leave encouraging comments on prayer requests
- **🔐 Authentication**: Secure user accounts with Supabase authentication
- **📱 Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **✅ Answered Prayers**: Mark prayer requests as answered with optional testimonies

## Tech Stack

- **🔧 Frontend**: Next.js 14, React 18, TypeScript
- **🎨 Styling**: Tailwind CSS, Radix UI components
- **🗄️ Backend**: Supabase (PostgreSQL database)
- **🔒 Authentication**: Supabase Auth, NextAuth.js
- **🚀 Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/danilobrizola/oratio.git
   cd oratio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

This project requires a Supabase project with the following tables:

- `users`: User accounts
- `prayers`: Prayer requests
- `comments`: Comments on prayers
- `prayer_counts`: Tracks who has prayed for each request
- `sessions`: User sessions
- `verification_tokens`: Email verification tokens
- `accounts`: OAuth accounts

Refer to the [Database Schema](#database-schema) section for detailed table structures.

## Project Structure

```
oratio/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── components/         # App-specific components
│   ├── prayers/            # Prayer request pages
│   └── profile/            # User profile pages
├── components/             # Shared UI components
├── lib/                    # Utility functions and shared code
│   ├── hooks/              # Custom React hooks
│   └── supabase.ts         # Supabase client initialization
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
├── supabase/               # Supabase configurations
├── types/                  # TypeScript type definitions
└── middleware.ts           # Next.js middleware
```

## Database Schema

### users
- `id`: UUID (primary key)
- `name`: Text
- `email`: Text (unique)
- `image`: Text (URL to profile image)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### prayers
- `id`: UUID (primary key)
- `title`: Text
- `content`: Text
- `author_id`: UUID (foreign key to users.id)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `is_anonymous`: Boolean
- `is_hidden`: Boolean
- `prayer_count`: Integer
- `status`: Text (e.g., 'pending', 'answered')
- `status_message`: Text

### comments
- `id`: UUID (primary key)
- `prayer_id`: UUID (foreign key to prayers.id)
- `author_id`: UUID (foreign key to users.id)
- `content`: Text
- `created_at`: Timestamp

### prayer_counts
- `id`: UUID (primary key)
- `prayer_id`: UUID (foreign key to prayers.id)
- `user_id`: UUID (foreign key to users.id)
- `created_at`: Timestamp

## Authentication Flow

Oratio uses Supabase Authentication with a custom adapter for NextAuth.js. The authentication flow includes:

1. User sign-up/login via email/password or OAuth providers
2. Session management with secure cookies
3. Protected routes requiring authentication
4. User profile synchronization between Supabase and application

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy the application

### Custom Server Deployment

1. Build the application
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server
   ```bash
   npm run start
   # or
   yarn start
   ```

## Support and Sponsorship ❤️

Oratio is proudly supported by:

- [FaithTech Hub Curitiba, Brazil](https://faithtech.com/city/curitiba/)
- [Snowman Labs](https://snowmanlabs.com)

## Free Setup Assistance 🤝

If your ministry, church, company, or initiative would like to use Oratio but doesn't have the technical knowledge to deploy or set it up, please reach out! We're happy to provide setup assistance at no cost.

## License

Oratio is released under the **MIT License**, making it free for anyone to use, modify, and distribute without charging for the platform itself. This open-source license allows for maximum flexibility while ensuring the platform remains freely accessible to all.

## Contact

Danilo Brizola - [danilo@faithtech.com](mailto:danilo@faithtech.com)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
