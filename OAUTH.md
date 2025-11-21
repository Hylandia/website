# Hylandia OAuth 2.0 Documentation

## Overview

Hylandia provides an OAuth 2.0 authorization flow that allows third-party applications to access user data securely.

## Authorization Endpoint

```
GET /oauth/authorize
```

### Parameters

| Parameter       | Required | Description                                                         |
| --------------- | -------- | ------------------------------------------------------------------- |
| `client_id`     | No\*     | Your application identifier (for display purposes)                  |
| `redirect_uri`  | **Yes**  | The URL to redirect after authorization                             |
| `response_type` | No       | Either `token` (default, hash fragment) or `code` (query parameter) |
| `scope`         | No       | Space-separated list of scopes (default: `user:read`)               |
| `state`         | No       | Random string to prevent CSRF attacks                               |

\*While not technically required, it's recommended for proper application identification.

### Example Authorization URL

```
https://hylandia.net/oauth/authorize?client_id=my-app&redirect_uri=https://myapp.com/callback&response_type=token&scope=user:read:email user:stats&state=random_string_here
```

## Scopes

OAuth scopes control what data and actions a third-party application can access. Multiple scopes can be requested by separating them with spaces.

| Scope              | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `user:read`        | Access basic profile information (username, display name) |
| `user:read:email`  | Access user email address                                 |
| `user:read:rbac`   | Access user role and permissions                          |
| `user`             | Full user access - grants all `user:*` permissions        |
| `user:stats`       | Access game statistics (wins, losses, level, XP)          |
| `user:preferences` | Access user preferences (notifications, theme, etc.)      |

### Scope Hierarchy

- The `user` scope is a special scope that grants **full access** to all `user:*` permissions
- **Parent-child relationship**: Having a child scope (e.g., `user:read:email`) grants access when a parent scope (e.g., `user:read`) is required
  - Example: If you have `user:read:email`, you can pass `user:read` assertions
  - However, you'll only get email data, not all data that `user:read` would normally grant
- `user:read` **by itself** grants basic profile access but NOT email or RBAC information
- For email access specifically, you must request `user:read:email`
- For role/permissions access specifically, you must request `user:read:rbac`

**Important**: The hierarchy works for **assertions** (permission checks) but **NOT for data access**. If you only have `user:read:email`, you pass `user:read` checks, but filtering still respects your specific scopes.

### Default Scope

If no scope is specified, the default scope is `user:read`.

## Response Types

### Token (Hash Fragment) - Default

When using `response_type=token`, the access token is returned in the URL hash fragment:

```
https://myapp.com/callback#access_token=eyJhbGc...&token_type=Bearer&expires_in=30d&state=random_string_here
```

### Code (Query Parameter)

When using `response_type=code`, the access token is returned as a query parameter:

```
https://myapp.com/callback?access_token=eyJhbGc...&token_type=Bearer&state=random_string_here
```

## Error Responses

If the user denies authorization or an error occurs:

**Token Response:**

```
https://myapp.com/callback?error=access_denied&error_description=User+denied+authorization&state=random_string_here
```

**Code Response:**

```
https://myapp.com/callback?error=access_denied&error_description=User+denied+authorization&state=random_string_here
```

## Using the Access Token

Include the access token in the `Authorization` header for API requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://hylandia.net/api/v1/auth/verify
```

## Token Verification

To verify a token and get user information:

```bash
POST /api/v1/auth/verify
Content-Type: application/json

{
  "token": "YOUR_ACCESS_TOKEN"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "clerkId": "...",
      "email": "user@example.com",
      "username": "player123",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "role": "player",
      "permissions": [],
      "preferences": {
        "notifications": true,
        "theme": "dark"
      },
      "stats": {
        "gamesPlayed": 42,
        "wins": 30,
        "losses": 12,
        "level": 15,
        "xp": 3500
      }
    },
    "authenticated": true
  }
}
```

## Example Integration

### JavaScript/TypeScript

```typescript
// 1. Redirect user to authorization page
const params = new URLSearchParams({
  client_id: "my-app",
  redirect_uri: "https://myapp.com/callback",
  response_type: "token",
  scope: "user:read:email user:stats user:preferences",
  state: generateRandomState(),
});

window.location.href = `https://hylandia.net/oauth/authorize?${params}`;

// 2. Handle callback (in your callback page)
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get("access_token");
const state = params.get("state");

// Verify state matches what you sent
if (state !== getStoredState()) {
  throw new Error("Invalid state parameter");
}

// 3. Use the token
const response = await fetch("https://hylandia.net/api/v1/auth/verify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token: accessToken }),
});

const { data } = await response.json();
console.log("User:", data.user);

// 4. Make authenticated API requests
const apiResponse = await fetch("https://hylandia.net/api/v1/user/stats", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### Python

```python
import requests
from urllib.parse import urlencode, urlparse, parse_qs

# 1. Generate authorization URL
params = {
    'client_id': 'my-app',
    'redirect_uri': 'https://myapp.com/callback',
    'response_type': 'code',
    'scope': 'user:read:email user:stats',
    'state': generate_random_state(),
}

auth_url = f"https://hylandia.net/oauth/authorize?{urlencode(params)}"
print(f"Visit: {auth_url}")

# 2. After user authorizes, extract token from redirect
# (Assuming you received the callback URL)
parsed_url = urlparse(callback_url)
query_params = parse_qs(parsed_url.query)
access_token = query_params['access_token'][0]

# 3. Verify token
response = requests.post(
    'https://hylandia.net/api/v1/auth/verify',
    json={'token': access_token}
)
user_data = response.json()['data']['user']

# 4. Make authenticated requests
headers = {'Authorization': f'Bearer {access_token}'}
stats = requests.get(
    'https://hylandia.net/api/v1/user/stats',
    headers=headers
).json()
```

## Scope-Based Data Filtering

API responses are automatically filtered based on the scopes granted to your OAuth token. For example:

- Without `user:read:email` scope, the `email` field will be omitted from user data
- Without `user:read:rbac` scope, the `role` and `permissions` fields will be omitted
- Without `user:stats` scope, game statistics endpoints will return a 403 Forbidden error

If you request data that requires a scope you don't have, the API will return a `403 Forbidden` error with a message indicating which scope is required.

## Security Best Practices

1. **Always use HTTPS** for redirect URIs in production
2. **Validate the state parameter** to prevent CSRF attacks
3. **Store tokens securely** (e.g., httpOnly cookies, secure storage)
4. **Use appropriate scopes** - only request what you need (principle of least privilege)
5. **Request specific scopes** - use `user:read:email` instead of `user` if you only need email
6. **Handle token expiration** - tokens expire after 30 days by default
7. **Validate redirect_uri** on your server to prevent open redirect vulnerabilities
8. **Handle 403 errors gracefully** - check if you have the required scope before making requests

## Token Lifespan

- Default expiration: **30 days**
- Tokens are long-lived JWT tokens
- No refresh token mechanism currently (re-authorize when expired)

## Rate Limiting

API requests are rate-limited per user. Excessive requests may result in temporary blocks.

## Support

For questions or issues, please contact: support@hylandia.net
