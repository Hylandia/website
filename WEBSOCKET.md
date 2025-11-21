# Hylandia WebSocket System

Custom typed WebSocket implementation with SHA256 authentication, heartbeats, and middleware support.

## 🚀 Quick Start

### Server Setup

The WebSocket server is automatically initialized in `server.js`. Add your event handlers in `src/lib/socket/handlers.ts`:

```typescript
import { socketServer } from "@/lib/socket";

socketServer.on("chat:message", async (client, data) => {
  // Broadcast to channel
  socketServer.broadcast("chat:message", data);
});
```

### Client Usage (React Hook - Recommended)

```typescript
import { useSocket } from "@/lib/socket/example-client";

function MyComponent() {
  // Automatically uses Clerk session token
  const { socket, connected, error } = useSocket();

  // Listen for events
  useEffect(() => {
    if (!connected) return;

    socket.on("chat:message", (data) => {
      console.log("New message:", data);
    });

    return () => socket.off("chat:message");
  }, [socket, connected]);

  // Emit events
  const sendMessage = () => {
    socket.emit("chat:message", {
      channelId: "general",
      message: "Hello!",
      userId: "user-123",
    });
  };

  if (error) return <div>Error: {error}</div>;
  return <div>Status: {connected ? "Connected" : "Disconnected"}</div>;
}
```

### Client Usage (Direct - Advanced)

```typescript
import { SocketClient } from "@/lib/socket/client";
import { useAuth } from "@clerk/nextjs";

function MyComponent() {
  const { getToken } = useAuth();
  const socket = new SocketClient();

  useEffect(() => {
    async function connect() {
      const token = await getToken(); // Get Clerk session token
      await socket.connect(token);
    }
    connect();
  }, []);

  // ... rest of implementation
}
```

### OAuth Token Usage (Third-Party Apps)

```typescript
import { useSocket } from "@/lib/socket/example-client";

function ThirdPartyComponent({ oauthToken }: { oauthToken: string }) {
  // Use OAuth token instead of Clerk
  const { socket, connected, error } = useSocket(oauthToken);

  // ... same as above
}
```

## 📝 Message Structure

All WebSocket messages follow this structure:

```typescript
{
  t: "event" | "heartbeat" | "auth" | "error" | "ack",
  evt: "event_name",
  data: { /* event data */ }
}
```

## 🔐 Authentication

The WebSocket server supports both **Clerk session tokens** and **OAuth JWT tokens**.

### How It Works

1. Client generates auth payload with SHA256 signature:

```typescript
{
  token: "jwt_token_or_clerk_session",
  timestamp: 1234567890,
  signature: "sha256_hmac_signature"
}
```

2. Server verifies:

   - Timestamp is within 5 minutes
   - Signature matches HMAC-SHA256(token:timestamp, JWT_SECRET)
   - Token is valid (either OAuth JWT or Clerk session)

3. Client is marked as authenticated

### Automatic (useSocket Hook)

The `useSocket` hook automatically:

- Fetches Clerk session token if user is signed in
- Or uses provided OAuth token
- Handles authentication automatically

```typescript
const { socket, connected, error } = useSocket(); // Auto Clerk auth
const { socket, connected, error } = useSocket(oauthToken); // OAuth auth
```

### Client-Side

```typescript
import { createAuthPayload } from "@/lib/socket/auth";

const authPayload = createAuthPayload(jwtToken);
socket.send({
  t: "auth",
  evt: "login",
  data: authPayload,
});
```

### Server-Side

Authentication happens automatically. Access user info:

```typescript
socketServer.on("chat:message", async (client, data) => {
  console.log("User ID:", client.userId);
  console.log("Authenticated:", client.authenticated);
});
```

## 💓 Heartbeats

- Server sends heartbeat every 30 seconds
- Client responds with pong
- Connections inactive for 60 seconds are closed
- Automatic cleanup runs every 10 seconds

## 🎯 Event Handling

### Register Handlers

```typescript
socketServer.on("chat:message", async (client, data) => {
  // Handle message
});
```

### Broadcast to All

```typescript
socketServer.broadcast("chat:message", {
  channelId: "general",
  message: "Hello everyone!",
  userId: "user-123",
});
```

### Broadcast with Filter

```typescript
socketServer.broadcast(
  "game:state",
  { gameId: "game-1", state: {} },
  (client) => client.metadata?.currentGame === "game-1"
);
```

### Send to Specific User

```typescript
socketServer.sendToUser(userId, "notification", {
  message: "You have a new message",
});
```

## 🛡️ Middlewares

### Built-in Middlewares

```typescript
import { requireAuth, rateLimit, logger } from "@/lib/socket/middlewares";

// Require authentication
socketServer.use(requireAuth);

// Rate limiting: 100 requests per minute
socketServer.use(rateLimit(100, 60000));

// Log all events
socketServer.use(logger);
```

### Custom Middleware

```typescript
const myMiddleware: SocketMiddleware = (client, message, next) => {
  // Your logic here
  if (someCondition) {
    next(); // Continue
  } else {
    // Block request
    client.ws.send(
      JSON.stringify({
        t: "error",
        evt: "error",
        data: { code: "BLOCKED", message: "Request blocked" },
      })
    );
  }
};

socketServer.use(myMiddleware);
```

## 📊 Client Metadata

Store custom data on clients:

```typescript
socketServer.on("game:join", async (client, data) => {
  client.metadata = {
    ...client.metadata,
    currentGame: data.gameId,
    role: "player",
  };
});
```

## 🎨 Adding New Events

1. Add event to `src/lib/socket/types.ts`:

```typescript
export interface SocketEvents {
  // ... existing events
  "my:event": { myData: string };
}
```

2. Register handler in `example-server.ts`:

```typescript
socketServer.on("my:event", async (client, data) => {
  console.log("My event:", data.myData);
});
```

3. Use in client:

```typescript
socket.emit("my:event", { myData: "Hello!" });
socket.on("my:event", (data) => {
  console.log(data.myData);
});
```

## 🔧 API Reference

### SocketServer

- `initialize(server)` - Initialize WebSocket server
- `on(event, handler)` - Register event handler
- `use(middleware)` - Add middleware
- `send(client, message)` - Send to specific client
- `sendError(client, error)` - Send error to client
- `broadcast(event, data, filter?)` - Broadcast to all/filtered clients
- `sendToUser(userId, event, data)` - Send to specific user
- `getClient(clientId)` - Get client by ID
- `getAuthenticatedClients()` - Get all authenticated clients
- `shutdown()` - Gracefully shutdown server

### SocketClient

- `connect(token?)` - Connect to WebSocket server
- `disconnect()` - Disconnect from server
- `emit(event, data)` - Emit event to server
- `on(event, callback)` - Listen for event
- `off(event, callback?)` - Remove event listener
- `isConnected()` - Check connection status

## 📁 File Structure

```
src/lib/socket/
├── types.ts              # TypeScript types
├── auth.ts               # SHA256 authentication
├── server.ts             # WebSocket server
├── client.ts             # Client library
├── middlewares.ts        # Built-in middlewares
├── index.ts              # Exports
├── handlers.ts           # Server-side event handlers
└── example-client.tsx    # Client-side React hook
```

## 🚀 Running

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

The WebSocket server runs on the same port as Next.js at `/api/v1/socket`.

## 🔒 Security Notes

- Always use HTTPS in production (wss://)
- JWT_SECRET must be strong and secure
- Signature prevents replay attacks (5-minute window)
- Rate limiting prevents abuse
- Authentication required for sensitive events
