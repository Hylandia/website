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
https://hylandia.net/oauth/authorize?client_id=my-app&redirect_uri=https://myapp.com/callback&response_type=token&scope=user:read user:stats&state=random_string_here
```

## Scopes

| Scope                 | Description                                      |
| --------------------- | ------------------------------------------------ |
| `user:read` or `user` | Access basic profile information and email       |
| `user:stats`          | Access game statistics (wins, losses, level, XP) |
| `user:preferences`    | Access user preferences                          |

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
  scope: "user:read user:stats",
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
    'scope': 'user:read user:stats',
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

## Security Best Practices

1. **Always use HTTPS** for redirect URIs in production
2. **Validate the state parameter** to prevent CSRF attacks
3. **Store tokens securely** (e.g., httpOnly cookies, secure storage)
4. **Use appropriate scopes** - only request what you need
5. **Handle token expiration** - tokens expire after 30 days by default
6. **Validate redirect_uri** on your server to prevent open redirect vulnerabilities

## Token Lifespan

- Default expiration: **30 days**
- Tokens are long-lived JWT tokens
- No refresh token mechanism currently (re-authorize when expired)

## Rate Limiting

API requests are rate-limited per user. Excessive requests may result in temporary blocks.

## Support

For questions or issues, please contact: support@hylandia.net
