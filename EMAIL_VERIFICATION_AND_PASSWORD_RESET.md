# Email Verification & Password Reset API Documentation

## Base URL

- Development: `https://api-dev.hylandia.net`
- Production: `https://api.hylandia.net`

All endpoints return JSON with the following structure:

```json
{
  "success": true,
  "code": 200,
  "data": { ... },
  "messages": []
}
```

---

## Email Verification Flow

### 1. Send Verification Code

**Endpoint:** `POST /v1/auth/user/verify-email/send-code`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Verification code sent to your email"
  },
  "messages": []
}
```

**Notes:**

- Sends a 6-digit verification code to the user's email
- Code expires in 5 minutes
- Safe to call even if email doesn't exist (won't reveal account existence)

---

### 2. Verify Email with Code

**Endpoint:** `POST /v1/auth/user/verify-email/verify`

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Success Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Email successfully verified"
  },
  "messages": []
}
```

**Error Response:**

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Invalid or expired verification code"]
}
```

**Notes:**

- Code is single-use and expires after 5 minutes
- Marks email as verified in Auth0
- User can now log in

---

## Password Reset Flow

### 1. Send Password Reset Code

**Endpoint:** `POST /v1/auth/user/forgot-password/send-code`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "If an account with that email exists, a verification code has been sent"
  },
  "messages": []
}
```

**Notes:**

- Sends a 6-digit verification code to the user's email
- Code expires in 5 minutes
- Doesn't reveal if account exists (security best practice)

---

### 2. Reset Password with Code

**Endpoint:** `POST /v1/auth/user/forgot-password/reset-password`

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecureP@ssw0rd!"
}
```

**Success Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "message": "Password successfully reset"
  },
  "messages": []
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Invalid or expired verification code"]
}
```

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Password must be at least 8 characters"]
}
```

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": [
    "This password has been found in a data breach and cannot be used. Please choose a different password."
  ]
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Must not be found in HaveIBeenPwned breach database

**Notes:**

- Code is single-use and expires after 5 minutes
- Password is validated for strength and breach status before updating
- Updates password in Auth0 Username-Password-Authentication connection

---

## Complete UI Flows

### Email Verification After Signup

1. User completes registration
2. Show "Check your email" screen
3. Call `POST /v1/auth/user/verify-email/send-code` with email
4. User enters 6-digit code from email
5. Call `POST /v1/auth/user/verify-email/verify` with email + code
6. On success, redirect to login or auto-login
7. On error, show error message and allow retry

**Example Code:**

```typescript
// Step 1: Send verification code
const sendResponse = await fetch(
  "https://api-dev.hylandia.net/v1/auth/user/verify-email/send-code",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail }),
  }
);

// Step 2: Verify code
const verifyResponse = await fetch(
  "https://api-dev.hylandia.net/v1/auth/user/verify-email/verify",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      code: enteredCode,
    }),
  }
);

if (verifyResponse.ok) {
  // Email verified! Redirect to login
  router.push("/login");
}
```

---

### Forgot Password Flow

1. User clicks "Forgot Password?" link
2. Show email input screen
3. User enters email
4. Call `POST /v1/auth/user/forgot-password/send-code` with email
5. Show "Check your email" screen
6. User enters 6-digit code + new password
7. Call `POST /v1/auth/user/forgot-password/reset-password` with email + code + newPassword
8. On success, redirect to login with success message
9. On error, show error message and allow retry

**Example Code:**

```typescript
// Step 1: Send reset code
const sendResponse = await fetch(
  "https://api-dev.hylandia.net/v1/auth/user/forgot-password/send-code",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail }),
  }
);

// Step 2: Reset password
const resetResponse = await fetch(
  "https://api-dev.hylandia.net/v1/auth/user/forgot-password/reset-password",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      code: enteredCode,
      newPassword: newPassword,
    }),
  }
);

if (resetResponse.ok) {
  // Password reset! Redirect to login
  router.push("/login?message=password-reset-success");
}
```

---

## Error Handling

All endpoints follow the same error format:

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "messages": ["Error message here"]
}
```

**Common Error Codes:**

- `400` - Bad Request (invalid input, weak password, breached password)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (email/username already exists)
- `500` - Internal Server Error

**Common Error Messages:**

- `"Invalid or expired verification code"` - Code is wrong, expired, or already used
- `"Password must be at least 8 characters"` - Password doesn't meet requirements
- `"This password has been found in a data breach and cannot be used"` - Password is breached
- `"Failed to verify email. Please try again."` - Generic error, check logs
- `"Failed to reset password. Please try again."` - Generic error, check logs

---

## Security Notes

1. **Verification codes are single-use** - Once verified, the same code cannot be used again
2. **Codes expire after 5 minutes** - User must request a new code if expired
3. **Email existence is not revealed** - Endpoints always return success to prevent account enumeration
4. **Passwords are validated** - Checked for strength and breach status before accepting
5. **Rate limiting recommended** - Implement rate limiting on frontend to prevent abuse
6. **CORS enabled** - API allows cross-origin requests from hylandia.net domains

---

## Testing

**Test the flow in Postman/curl:**

```bash
# 1. Send verification code
curl -X POST https://api-dev.hylandia.net/v1/auth/user/verify-email/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check email for code, then verify
curl -X POST https://api-dev.hylandia.net/v1/auth/user/verify-email/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
```

```bash
# 1. Send password reset code
curl -X POST https://api-dev.hylandia.net/v1/auth/user/forgot-password/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Reset password with code
curl -X POST https://api-dev.hylandia.net/v1/auth/user/forgot-password/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","newPassword":"NewP@ssw0rd123"}'
```
