// Server exports
export { socketServer, SocketServer } from "./server";
export {
  verifyAuthPayload,
  generateSignature,
  createAuthPayload,
} from "./auth";
export { handleRuntimeError } from "./handlers";

export { SocketClient } from "./client";

export type {
  SocketMessage,
  SocketClient as SocketClientType,
  SocketEventHandler,
  SocketMiddleware,
  SocketEvents,
  SocketEventName,
  SocketEventData,
  AuthPayload,
  HeartbeatPayload,
  ErrorPayload,
  AckPayload,
} from "./types";
