# Hylandia

A modern, full-stack web application for Hytale minigames server with integrated authentication, OAuth 2.0 support, and user management.

## 🚀 Features

- **Dual Authentication System**

  - Clerk-based authentication for web users (Email/Password + OAuth social login)
  - Custom OAuth 2.0 implementation for third-party applications
  - JWT token generation and verification
  - Hierarchical scope-based access control

- **User Management**

  - Profile management with avatar upload
  - Account connections (Google, GitHub, Microsoft)
  - Session management and security settings
  - User preferences and game statistics
  - Role-based access control (RBAC)

- **OAuth 2.0 Server**

  - Authorization endpoint with consent screen
  - Granular scopes: `user:read`, `user:read:email`, `user:read:rbac`, `user:stats`, `user:preferences`
  - Token and Code response types
  - Automatic data filtering based on granted scopes
  - State parameter support for CSRF protection

- **Modern UI/UX**

  - Responsive design with Tailwind CSS
  - Framer Motion animations
  - Dark theme with custom color palette
  - Shadcn UI components
  - Settings pages with shared layouts

- **API Infrastructure**
  - RESTful API with Next.js Route Handlers
  - MongoDB with custom ODM layer
  - Redis for caching and session management
  - Type-safe request/response handling
  - Comprehensive error handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **pnpm** (recommended) or npm
- **MongoDB** 4.4 or higher
- **Redis** 6.x or higher
- **Clerk Account** (for authentication) - [Sign up at clerk.com](https://clerk.com)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Hylandia/website hylandia
cd hylandia
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

```env
# Environment
NODE_ENV=development

# Database
DATABASE_URI=mongodb://localhost:27017/hylandia
REDIS_URI=redis://localhost:6379

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# JWT for OAuth
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRY=30d
```

### 4. Set up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys from the dashboard
4. Enable the following OAuth providers (optional):
   - Google
   - GitHub
   - Microsoft
5. Configure your application settings:
   - Set development URL: `http://localhost:3000`
   - Add redirect URLs if needed

### 5. Start local services

**MongoDB:**

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

**Redis:**

```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or using local installation
redis-server
```

### 6. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

```
hylandia/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   └── v1/
│   │   │       ├── auth/         # Authentication endpoints
│   │   │       │   ├── me/       # Get current user
│   │   │       │   ├── token/    # Generate OAuth token
│   │   │       │   └── verify/   # Verify token
│   │   │       └── route.ts      # API health check
│   │   ├── auth/                 # Auth pages
│   │   │   ├── page.tsx          # Login/Register
│   │   │   └── sso-callback/     # OAuth callback
│   │   ├── oauth/                # OAuth 2.0 server
│   │   │   └── authorize/        # Authorization endpoint
│   │   ├── settings/             # User settings pages
│   │   │   ├── account/          # Profile management
│   │   │   ├── connections/      # Account connections
│   │   │   ├── security/         # Session management
│   │   │   ├── preferences/      # User preferences
│   │   │   ├── game-stats/       # Game statistics
│   │   │   └── layout.tsx        # Shared settings layout
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication components
│   │   ├── home/                 # Home page sections
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── Navigation.tsx        # Main navigation
│   │   └── UserButton.tsx        # User dropdown
│   ├── config/
│   │   └── env.ts                # Environment validation
│   ├── lib/                      # Utilities and libraries
│   │   ├── db/                   # Database layer
│   │   │   ├── models/           # MongoDB models
│   │   │   ├── index.ts          # DB connection
│   │   │   └── odm.ts            # ODM setup
│   │   ├── api-utils.ts          # API helpers
│   │   ├── oauth-scopes.ts       # OAuth scope utilities
│   │   ├── permissions.ts        # RBAC permissions
│   │   ├── rbac.ts               # Role-based access control
│   │   ├── redis.ts              # Redis client
│   │   ├── utils.ts              # Common utilities
│   │   └── zod-utils.ts          # Zod helpers
│   ├── providers/                # React providers
│   │   ├── ClerkProvider.tsx     # Clerk wrapper
│   │   └── QueryProvider.tsx     # React Query
│   ├── schemas/
│   │   └── auth.schema.ts        # Validation schemas
│   └── types/
│       └── globals.d.ts          # TypeScript declarations
├── public/                       # Static assets
├── .env.example                  # Environment template
├── .env.local                    # Local environment (gitignored)
├── biome.json                    # Biome configuration
├── components.json               # Shadcn config
├── next.config.ts                # Next.js configuration
├── OAUTH.md                      # OAuth documentation
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
```

## 🔐 Authentication

### For Users (Web)

The application uses Clerk for user authentication with support for:

- Email/Password authentication
- Social OAuth (Google, GitHub, Microsoft)
- Email verification
- Session management
- Multi-factor authentication (via Clerk)

### For Third-Party Apps (OAuth 2.0)

Hylandia provides a custom OAuth 2.0 server for third-party integrations. See [OAUTH.md](./OAUTH.md) for complete documentation.

**Quick Start:**

1. Direct users to the authorization endpoint:

```
https://hylandia.net/oauth/authorize?client_id=your-app&redirect_uri=https://your-app.com/callback&response_type=token&scope=user:read:email user:stats&state=random_state
```

2. Handle the callback with the access token
3. Use the token in API requests:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://hylandia.net/api/v1/auth/me
```

## 📊 Database Schema

### User Model

```typescript
{
  clerkId: string;          // Clerk user ID
  email?: string;           // User email
  username?: string;        // Username
  firstName?: string;       // First name
  lastName?: string;        // Last name
  avatar?: string;          // Avatar URL
  role: 'admin' | 'moderator' | 'player';
  permissions: string[];    // Extra permissions
  preferences: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    level: number;
    xp: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌐 API Endpoints

### Authentication

- `POST /api/v1/auth/token` - Generate OAuth JWT token
- `POST /api/v1/auth/verify` - Verify and decode token
- `GET /api/v1/auth/me` - Get current user (scope-filtered)

### Health

- `GET /api/v1` - API health check

## 🎨 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - Component library
- **Lucide React** - Icons

### Backend

- **Next.js API Routes** - Serverless functions
- **MongoDB** - Database with custom ODM
- **Redis** - Caching and sessions
- **Clerk** - Authentication provider
- **JWT** - OAuth token generation

### Developer Tools

- **Biome** - Linting and formatting
- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **TanStack Query** - Server state management

## 🔒 Security

- **Environment validation** - Enforced required env vars
- **JWT tokens** - HS256 signed with 30-day expiry
- **OAuth state parameter** - CSRF protection
- **Scope-based access control** - Granular permissions
- **Password hashing** - Managed by Clerk
- **HTTPS only** - Production requirement

## 🚢 Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment.

### Database

1. Set up a MongoDB instance (MongoDB Atlas recommended)
2. Set up a Redis instance (Upstash or Redis Labs recommended)
3. Update `DATABASE_URI` and `REDIS_URI` in production env

### Clerk Configuration

1. Add production domain to allowed origins
2. Set up production OAuth redirect URLs
3. Configure webhook endpoints (if needed)

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📝 Environment Variables Reference

| Variable                            | Required | Description                           | Example                              |
| ----------------------------------- | -------- | ------------------------------------- | ------------------------------------ |
| `NODE_ENV`                          | No       | Environment mode                      | `development`                        |
| `DATABASE_URI`                      | Yes      | MongoDB connection string             | `mongodb://localhost:27017/hylandia` |
| `REDIS_URI`                         | Yes      | Redis connection string               | `redis://localhost:6379`             |
| `CLERK_SECRET_KEY`                  | Yes      | Clerk secret key                      | `sk_test_...`                        |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk publishable key                 | `pk_test_...`                        |
| `JWT_SECRET`                        | Yes      | Secret for JWT signing (min 32 chars) | `your-secret-key`                    |
| `JWT_EXPIRY`                        | No       | JWT token expiration                  | `30d`                                |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [OAuth 2.0 RFC](https://oauth.net/2/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Support

For questions or issues, please contact: support@hylandia.net
