# Hylandia API - Authentication Documentation

## Base URL

`production`

```
https://api.hylandia.com/v1/auth
```

`development`

```
http://localhost:3001/api/auth
```

All endpoints return JSON with the following structure:

```typescript
{
  "success": boolean,
  "code": number,
  "data": any | null,
  "messages": string[]
}
```

---

## Authentication Endpoints

### 1. User Registration

**POST** `/auth/user/register`

Register a new user account.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "username": "username123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Request Body Schema

```typescript
{
  email: string;        // Required: Valid email format
  password: string;     // Required: Min 8 chars, must include uppercase, lowercase, number, special char
  username: string;     // Required: Unique username
  firstName?: string;   // Optional: User's first name
  lastName?: string;    // Optional: User's last name
}
```

#### Success Response (201)

```json
{
  "success": true,
  "code": 201,
  "data": {
    "user": {
      "id": "auth0|123456789",
      "email": "user@example.com",
      "username": "username123",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false
    },
    "message": "Registration successful. Please check your email to verify your account."
  },
  "messages": []
}
```

#### Error Response (400)

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Email already exists"]
}
```

#### Error Response (422)

```json
{
  "success": false,
  "code": 422,
  "data": null,
  "messages": ["Validation error: password must be at least 8 characters"]
}
```

---

### 2. User Login

**POST** `/auth/user/login`

Authenticate a user and receive session tokens.

#### Request Body

```json
{
  "identifier": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Request Body Schema

```typescript
{
  identifier: string; // Required: Email or username
  password: string; // Required: User's password
}
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MRrtrvIkJG6xGb3GEHBb...",
    "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "sub": "auth0|123456789",
      "email": "user@example.com",
      "username": "username123",
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  },
  "messages": []
}
```

**Note:** A session cookie named `session` is also set as an httpOnly cookie.

#### Cookie Details

```
Name: session
Value: JWT token
HttpOnly: true
Secure: true
SameSite: strict
Max-Age: 86400 (24 hours)
Path: /
```

#### Error Response (401) - Invalid Credentials

```json
{
  "success": false,
  "code": 401,
  "data": null,
  "messages": ["Wrong email or password"]
}
```

#### Error Response (403) - Email Not Verified

```json
{
  "success": false,
  "code": 403,
  "data": null,
  "messages": [
    "Please verify your email address before logging in. Check your inbox for a verification email."
  ]
}
```

---

### 3. User Logout

**POST** `/auth/user/logout`

Log out the current user and revoke their session.

#### Request Headers

```
Cookie: session=<jwt_token>
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Logged out successfully"
  },
  "messages": []
}
```

**Note:** The session cookie is cleared on successful logout.

#### Error Response (401)

```json
{
  "success": false,
  "code": 401,
  "data": null,
  "messages": ["User not authenticated"]
}
```

---

### 4. Get Current User

**GET** `/auth/user/me`

Get the currently authenticated user's details.

#### Request Headers

```
Cookie: session=<jwt_token>
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "auth0Id": "auth0|123456789",
    "email": "user@example.com",
    "username": "username123",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "provider": "auth0",
    "roles": ["USER"],
    "roleIds": [],
    "permissions": [
      "user:read",
      "user:update",
      "session:read:own",
      "session:revoke:own",
      "relationship:read:own",
      "relationship:create",
      "relationship:update:own",
      "relationship:delete:own"
    ],
    "createdAt": "2025-11-24T12:00:00.000Z",
    "updatedAt": "2025-11-24T12:00:00.000Z"
  },
  "messages": []
}
```

#### Error Response (401)

```json
{
  "success": false,
  "code": 401,
  "data": null,
  "messages": ["User not authenticated"]
}
```

---

### 5. Resend Email Verification

**POST** `/auth/user/resend-verification`

Request a new email verification link.

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Request Body Schema

```typescript
{
  email: string; // Required: Email address to resend verification to
}
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Email verification is handled automatically by Auth0. Please check your inbox for the verification email sent during signup.",
    "note": "If you didn't receive it, please contact support or try signing up again."
  },
  "messages": []
}
```

#### Error Response (400)

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Email is required"]
}
```

---

## Session Management Endpoints

### 6. Get Active Sessions

**GET** `/auth/user/sessions`

Get all active sessions for the current user.

#### Request Headers

```
Cookie: session=<jwt_token>
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "auth0Id": "auth0|123456789",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "deviceInfo": {
        "deviceType": "desktop",
        "deviceName": "Windows",
        "browser": "Chrome",
        "browserVersion": "119.0.0.0",
        "os": "Windows",
        "osVersion": "10"
      },
      "location": {
        "country": "United States",
        "region": "California",
        "city": "San Francisco",
        "lat": 37.7749,
        "lon": -122.4194
      },
      "isActive": true,
      "isCurrent": true,
      "lastActiveAt": "2025-11-24T12:30:00.000Z",
      "expiresAt": "2025-11-25T12:00:00.000Z",
      "createdAt": "2025-11-24T12:00:00.000Z",
      "updatedAt": "2025-11-24T12:30:00.000Z"
    }
  ],
  "messages": []
}
```

#### Error Response (401)

```json
{
  "success": false,
  "code": 401,
  "data": null,
  "messages": ["User not authenticated"]
}
```

---

### 7. Revoke Session

**DELETE** `/auth/user/sessions/:id`

Revoke a specific session by ID.

#### URL Parameters

```
:id - MongoDB ObjectId of the session to revoke
```

#### Request Headers

```
Cookie: session=<jwt_token>
```

#### Success Response (200)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Session revoked successfully"
  },
  "messages": []
}
```

#### Error Response (400) - Invalid ID

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Invalid session ID format"]
}
```

#### Error Response (404) - Session Not Found

```json
{
  "success": false,
  "code": 404,
  "data": null,
  "messages": ["Session not found"]
}
```

#### Error Response (403) - Not Owner

```json
{
  "success": false,
  "code": 403,
  "data": null,
  "messages": ["You can only revoke your own sessions"]
}
```

---

## Authentication Flow

### Registration Flow

1. User submits registration form
2. API validates input and creates Auth0 user
3. Auth0 sends email verification automatically
4. User receives success response
5. User must verify email before logging in

### Login Flow

1. User submits login credentials
2. API validates with Auth0
3. If email not verified, return 403 error
4. If successful, create session in database
5. Set httpOnly session cookie
6. Return access tokens and user data

### Session Management Flow

1. All authenticated requests include session cookie
2. Middleware validates session token
3. Middleware loads user roles and permissions
4. Middleware updates `lastActiveAt` timestamp
5. Session expires after 24 hours

---

## Error Codes

| Code | Description                                 |
| ---- | ------------------------------------------- |
| 200  | Success                                     |
| 201  | Created successfully                        |
| 400  | Bad request - Invalid input                 |
| 401  | Unauthorized - Not authenticated            |
| 403  | Forbidden - Authenticated but no permission |
| 404  | Not found                                   |
| 422  | Validation error                            |
| 500  | Internal server error                       |

---

## Authentication States

### User Model

```typescript
interface User {
  _id: string; // MongoDB ObjectId
  auth0Id: string; // Auth0 user ID (format: auth0|123456789)
  email: string; // Unique email
  username: string; // Unique username
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  avatarUrl?: string; // Profile picture URL
  provider: string; // Auth provider (always "auth0")
  roles: string[]; // User roles (e.g., ["USER", "ADMIN"])
  roleIds: string[]; // MongoDB ObjectIds of role documents
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### Session Model

```typescript
interface Session {
  _id: string; // MongoDB ObjectId
  userId: string; // MongoDB ObjectId reference to User
  auth0Id: string; // Auth0 user ID
  sessionToken: string; // JWT session token
  ipAddress: string; // IP address of the session
  userAgent: string; // Browser user agent string
  deviceInfo: {
    deviceType: string; // "desktop" | "mobile" | "tablet"
    deviceName: string; // OS name
    browser: string; // Browser name
    browserVersion: string; // Browser version
    os: string; // Operating system
    osVersion: string; // OS version
  };
  location?: {
    country: string; // Country name
    region: string; // State/province
    city: string; // City name
    lat: number; // Latitude
    lon: number; // Longitude
  };
  isActive: boolean; // Whether session is active
  lastActiveAt: Date; // Last activity timestamp
  expiresAt: Date; // Session expiration (24 hours from creation)
  createdAt: Date; // Session creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

---

## RBAC (Role-Based Access Control)

### Available Roles

```typescript
enum Role {
  SUPER_ADMIN = "SUPER_ADMIN", // Full system access
  ADMIN = "ADMIN", // Administrative access
  MODERATOR = "MODERATOR", // Moderation capabilities
  USER = "USER", // Standard user (default)
  GUEST = "GUEST", // Limited read-only access
}
```

### Available Permissions

```typescript
// User Management
"user:read";
"user:create";
"user:update";
"user:delete";
"user:list";

// Role Management
"role:read";
"role:create";
"role:update";
"role:delete";
"role:assign";

// Session Management
"session:read:own"; // Read own sessions
"session:read:any"; // Read any user's sessions
"session:revoke:own"; // Revoke own sessions
"session:revoke:any"; // Revoke any user's sessions

// Relationship Management
"relationship:read:own";
"relationship:read:any";
"relationship:create";
"relationship:update:own";
"relationship:update:any";
"relationship:delete:own";
"relationship:delete:any";

// Admin
"admin:panel:access";
"system:settings";
"audit:log:read";
```

### Default Permissions by Role

**USER** (Default):

- user:read, user:update (own profile)
- session:read:own, session:revoke:own
- relationship:read:own, relationship:create, relationship:update:own, relationship:delete:own

**MODERATOR**:

- All USER permissions
- relationship:read:any
- audit:log:read

**ADMIN**:

- All MODERATOR permissions
- user:create, user:list
- role:read, role:assign
- session:read:any, session:revoke:any
- relationship:update:any, relationship:delete:any
- admin:panel:access

**SUPER_ADMIN**:

- All permissions

---

## Frontend Implementation Guide

### 1. Setup Axios Instance

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.hylandia.com/v1",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

### 2. Authentication Service

```typescript
import api from "./api";

export const authService = {
  async register(data: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }) {
    return api.post("/auth/user/register", data);
  },

  async login(identifier: string, password: string) {
    return api.post("/auth/user/login", { identifier, password });
  },

  async logout() {
    return api.post("/auth/user/logout");
  },

  async getCurrentUser() {
    return api.get("/auth/user/me");
  },

  async resendVerification(email: string) {
    return api.post("/auth/user/resend-verification", { email });
  },

  async getSessions() {
    return api.get("/auth/user/sessions");
  },

  async revokeSession(sessionId: string) {
    return api.delete(`/auth/user/sessions/${sessionId}`);
  },
};
```

### 3. React Auth Context Example

```typescript
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "./services/auth";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(identifier: string, password: string) {
    const response = await authService.login(identifier, password);
    setUser(response.data.user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  async function register(data: any) {
    await authService.register(data);
  }

  function hasPermission(permission: string): boolean {
    return user?.permissions.includes(permission) ?? false;
  }

  function hasRole(role: string): boolean {
    return user?.roles.includes(role) ?? false;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 4. Protected Route Component

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({
  children,
  permission,
  role,
}: {
  children: React.ReactNode;
  permission?: string;
  role?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (permission && !user.permissions.includes(permission)) {
    return <Navigate to="/unauthorized" />;
  }

  if (role && !user.roles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

### 5. Usage Example

```typescript
// In your app
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute permission="user:list">
              <UserList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

// Login component
function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(identifier, password);
      // Redirect handled by router
    } catch (err: any) {
      setError(err.messages[0] || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="Email or username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Important Notes

1. **Cookies**: The API uses httpOnly cookies for session management. Ensure `withCredentials: true` is set in your HTTP client.

2. **Email Verification**: Users must verify their email before they can log in. The verification email is sent automatically by Auth0.

3. **Session Expiry**: Sessions expire after 24 hours. Implement automatic logout or refresh token logic.

4. **CORS**: The API is configured to accept credentials from allowed origins only.

5. **Rate Limiting**: Consider implementing client-side rate limiting for login attempts.

6. **Password Requirements**:

   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

7. **Error Handling**: Always check the `success` field in responses and handle errors appropriately.

---

## Testing the API

### Using cURL

**Register:**

```bash
curl -X POST https://api.hylandia.com/v1/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**

```bash
curl -X POST https://api.hylandia.com/v1/auth/user/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "identifier": "test@example.com",
    "password": "Test1234!"
  }'
```

**Get Current User:**

```bash
curl -X GET https://api.hylandia.com/v1/auth/user/me \
  -b cookies.txt
```

**Logout:**

```bash
curl -X POST https://api.hylandia.com/v1/auth/user/logout \
  -b cookies.txt
```
