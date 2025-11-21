import { WebSocket } from "ws";

/**
 * Base socket message structure
 */
export interface SocketMessage<T = any> {
  t: "event" | "heartbeat" | "auth" | "error" | "ack";
  evt: string;
  data: T;
}

/**
 * Authentication payload
 */
export interface AuthPayload {
  token: string;
  timestamp: number;
  signature: string;
}

/**
 * Heartbeat payload
 */
export interface HeartbeatPayload {
  timestamp: number;
}

/**
 * Error payload
 */
export interface ErrorPayload {
  code: string;
  message: string;
}

/**
 * Acknowledgment payload
 */
export interface AckPayload {
  eventId?: string;
  success: boolean;
}

/**
 * Client connection information
 */
export interface SocketClient {
  id: string;
  ws: WebSocket;
  authenticated: boolean;
  userId?: string;
  lastHeartbeat: number;
  metadata?: Record<string, any>;
}

/**
 * Socket event handler
 */
export type SocketEventHandler<T = any> = (
  client: SocketClient,
  data: T
) => void | Promise<void>;

/**
 * Socket middleware
 */
export type SocketMiddleware = (
  client: SocketClient,
  message: SocketMessage,
  next: () => void
) => void | Promise<void>;

/**
 * Typed event map for type safety
 */
export interface SocketEvents {
  connect: {};
  "connection:established": { clientId: string };
  disconnect: {};

  "auth:login": AuthPayload;
  "auth:logout": {};
  "auth:success": { userId: string };
  "auth:failed": ErrorPayload;

  "heartbeat:ping": HeartbeatPayload;
  "heartbeat:pong": HeartbeatPayload;

  // synciing user data across in game and web, maybe useful? idk.
  "user:update": { userId: string; data: any };
  "user:status": { userId: string; status: string; timestamp?: number };

  // Maybe game events in the future?
  "game:join": { gameId: string };
  "game:leave": { gameId: string };
  "game:state": {
    gameId: string;
    state: {
      playerJoined?: string;
      playerLeft?: string;
      timestamp?: number;
      [key: string]: any;
    };
  };

  error: ErrorPayload;
}


export type SocketEventName = keyof SocketEvents;

export type SocketEventData<T extends SocketEventName> = SocketEvents[T];
