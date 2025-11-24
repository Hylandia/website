# Clerk Removal - Integration Guide

All Clerk dependencies have been successfully removed from the Hylandia project. Below are the areas that need to be integrated with your custom API server.

## Overview of Changes

### Files Modified

- ✅ `package.json` - Removed @clerk/nextjs, @clerk/themes, @clerk/types
- ✅ `src/config/env.ts` - Removed CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- ✅ `src/app/layout.tsx` - Removed ClerkProvider wrapper
- ✅ `src/app/auth/page.tsx` - Replaced with custom auth implementation
- ✅ `src/components/Navigation.tsx` - Updated to use localStorage token check
- ✅ `src/components/UserButton.tsx` - Updated to fetch user from API
- ✅ `src/components/auth/SocialLogin.tsx` - Updated to use simple provider strings
- ✅ `src/components/auth/ErrorDisplay.tsx` - Removed Clerk error types
- ✅ `src/components/auth/EmailVerification.tsx` - Removed Clerk error types
- ✅ `src/lib/socket/useSocket.tsx` - Updated to use localStorage token
- ✅ `src/lib/db/models/user.model.ts` - Removed clerkId, updated to use email-based lookup
- ✅ `src/app/logout/page.tsx` - Updated to clear localStorage token
- ✅ `src/app/oauth/authorize/page.tsx` - Placeholder for OAuth integration
- ✅ `src/app/settings/account/page.tsx` - Placeholder for account settings
- ✅ `src/app/settings/security/page.tsx` - Placeholder for security settings

### Files Deleted

- ✅ `src/providers/ClerkProvider.tsx`
- ✅ `src/app/auth/sso-callback/` (entire directory)

---

## Integration Points

### 1. Authentication - Login/Register (`src/app/auth/page.tsx`)

**Current Implementation:**

```typescript
const onSignIn = async (data: SignInFormData) => {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.token) {
    localStorage.setItem("auth_token", result.token);
  }

  router.push(redirectUrl || "/");
};
```

**Your API Should:**

- Accept POST to `/api/v1/auth/login` with `{ email, password }`
- Return `{ token: string, expiresIn?: string }` on success
- Return `{ errors: [{ message: string, code?: string }] }` on failure

**Registration:**

- Accept POST to `/api/v1/auth/register` with `{ email, password, username, firstName, lastName }`
- Return same format as login

---

### 2. Social Login (`src/components/auth/SocialLogin.tsx`)

**Current Implementation:**

```typescript
const handleSocialLogin = async (provider: string) => {
  window.location.href = `/api/v1/auth/oauth/${provider}?redirect_url=${encodeURIComponent(
    redirectUrl || "/"
  )}`;
};
```

**Providers:** `"google"`, `"github"`, `"microsoft"`

**Your API Should:**

- Implement OAuth flows for each provider at `/api/v1/auth/oauth/{provider}`
- Accept `redirect_url` query parameter
- After successful OAuth, redirect back to `redirect_url` with token in query/hash
- Example: `https://hylandia.net/?access_token=xxx&token_type=Bearer`

---

### 3. User Data Fetching (`src/components/UserButton.tsx`)

**Current Implementation:**

```typescript
const response = await fetch("/api/v1/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const userData = await response.json();
setUser(userData);
```

**Your API Should:**

- Accept GET to `/api/v1/auth/me` with Authorization header
- Return user object: `{ id, email, username, avatar, firstName, lastName, role, permissions }`

---

### 4. Navigation Auth Check (`src/components/Navigation.tsx`)

**Current Implementation:**

```typescript
useEffect(() => {
  const token = localStorage.getItem("auth_token");
  setIsSignedIn(!!token);
}, []);
```

**Recommended Enhancement:**

```typescript
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsSignedIn(false);
      return;
    }

    // Verify token is still valid
    try {
      const response = await fetch("/api/v1/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSignedIn(response.ok);
    } catch {
      setIsSignedIn(false);
      localStorage.removeItem("auth_token");
    }
  };

  checkAuth();
}, []);
```

**Your API Should:**

- Accept GET to `/api/v1/auth/verify` with Authorization header
- Return 200 if token is valid, 401 if invalid/expired

---

### 5. WebSocket Authentication (`src/lib/socket/useSocket.tsx`)

**Current Implementation:**

```typescript
const token = localStorage.getItem("auth_token");
await socket.connect(token);
```

Your WebSocket server should accept the token for authentication.

---

### 6. Logout (`src/app/logout/page.tsx`)

**Current Implementation:**

```typescript
localStorage.removeItem("auth_token");
router.push("/");
```

**Recommended Enhancement:**

```typescript
// Call API to invalidate token server-side
await fetch("/api/v1/auth/logout", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
});

localStorage.removeItem("auth_token");
router.push("/");
```

---

### 7. Database User Model (`src/lib/db/models/user.model.ts`)

**Updated Schema:**

```typescript
interface IUser {
  email: string; // Required, unique
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string; // Default: "player"
  permissions?: string[];
  preferences?: {
    notifications?: boolean;
    theme?: "light" | "dark" | "system";
  };
  stats?: {
    gamesPlayed?: number;
    wins?: number;
    losses?: number;
    level?: number;
    xp?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Available Methods:**

- `UserQueries.findByEmail(email: string)`
- `UserQueries.findById(id: string)`
- `UserQueries.findOrCreate(userData)` - Creates user if doesn't exist
- `UserMutations.updateUser(userId, updates)`
- `UserMutations.updateStats(userId, stats)`

---

## Required API Endpoints Summary

| Method | Endpoint                       | Purpose               | Auth Required |
| ------ | ------------------------------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/login`           | Email/password login  | No            |
| POST   | `/api/v1/auth/register`        | User registration     | No            |
| GET    | `/api/v1/auth/oauth/google`    | Google OAuth          | No            |
| GET    | `/api/v1/auth/oauth/github`    | GitHub OAuth          | No            |
| GET    | `/api/v1/auth/oauth/microsoft` | Microsoft OAuth       | No            |
| GET    | `/api/v1/auth/me`              | Get current user      | Yes           |
| GET    | `/api/v1/auth/verify`          | Verify token validity | Yes           |
| POST   | `/api/v1/auth/logout`          | Invalidate token      | Yes           |
| POST   | `/api/v1/auth/token`           | Generate OAuth token  | Yes           |

---

## Token Storage

Currently using `localStorage.setItem("auth_token", token)`.

**Considerations:**

- LocalStorage is vulnerable to XSS attacks
- Consider using httpOnly cookies for production
- If using cookies, update all `localStorage.getItem("auth_token")` calls

**To switch to cookies:**

1. Have your API set httpOnly cookie on login
2. Replace localStorage calls with cookie reads (or let browser handle automatically)
3. Update all fetch calls to include `credentials: "include"`

---

## Settings Pages

The following pages are placeholders awaiting your API integration:

- `/settings/account` - Update profile, avatar, username
- `/settings/security` - Password management, sessions
- `/settings/connections` - OAuth account connections
- `/settings/preferences` - User preferences
- `/settings/game-stats` - Game statistics

These currently show "Coming Soon" messages.

---

## Email Verification (Optional)

The `EmailVerification` component exists but is not currently used in the auth flow. If you want to implement email verification:

1. After registration, instead of logging in immediately:

   ```typescript
   setVerifying(true);
   ```

2. Show verification code input

3. Call your API to verify:
   ```typescript
   await fetch("/api/v1/auth/verify-email", {
     method: "POST",
     body: JSON.stringify({ email, code }),
   });
   ```

---

## Next Steps

1. **Create your API endpoints** matching the specification above
2. **Test authentication flow:**

   - Login with email/password
   - Registration
   - OAuth providers (Google, GitHub, Microsoft)
   - Token verification
   - Logout

3. **Update token storage** if using cookies instead of localStorage

4. **Implement settings pages** to allow users to manage their accounts

5. **Optional: Add email verification** to the registration flow

6. **Update environment variables** in `.env.local`:

   ```
   # Remove these (no longer needed):
   # CLERK_SECRET_KEY
   # NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

   # Keep these:
   DATABASE_URI=...
   REDIS_URI=...
   JWT_SECRET=...
   JWT_EXPIRY=30d
   ```

---

## Testing Checklist

- [ ] Login with email/password
- [ ] Register new account
- [ ] Google OAuth login
- [ ] GitHub OAuth login
- [ ] Microsoft OAuth login
- [ ] User dropdown shows correct data
- [ ] Mobile navigation shows user options
- [ ] Logout clears session
- [ ] Protected routes redirect to /auth
- [ ] WebSocket connects with token
- [ ] Token verification on page load

---

## Questions?

The codebase is now clean of Clerk dependencies and ready for your custom API integration. All TODO comments mark areas where you need to implement your API calls.

Key files to review:

- `src/app/auth/page.tsx` - Main auth logic
- `src/components/Navigation.tsx` - Auth state checking
- `src/components/UserButton.tsx` - User data fetching
- `src/lib/db/models/user.model.ts` - Database schema
