import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { randomUUID } from "crypto";
import {
  SocketClient,
  SocketMessage,
  SocketEventHandler,
  SocketMiddleware,
  SocketEventName,
  SocketEventData,
  HeartbeatPayload,
  ErrorPayload,
} from "./types";
import { verifyAuthPayload } from "./auth";

export class SocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, SocketClient> = new Map();
  private handlers: Map<string, SocketEventHandler[]> = new Map();
  private middlewares: SocketMiddleware[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_TIMEOUT = 60000; // 60 seconds
  private readonly CLEANUP_INTERVAL = 10000; // 10 seconds

  constructor() {}

  public initialize(server: any): void {
    if (this.wss) {
      console.log("⚠️ WebSocket server already initialized");
      return;
    }

    this.wss = new WebSocketServer({ noServer: true });
    this.wss.on("connection", this.handleConnection.bind(this));
    this.startHeartbeat();
    this.startCleanup();
    console.log("✅ WebSocket server initialized");
  }

  public isInitialized(): boolean {
    return this.wss !== null;
  }

  public handleUpgrade(
    request: IncomingMessage,
    socket: any,
    head: Buffer
  ): void {
    if (!this.wss) {
      socket.destroy();
      return;
    }

    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss?.emit("connection", ws, request);
    });
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = randomUUID();
    const client: SocketClient = {
      id: clientId,
      ws,
      authenticated: false,
      lastHeartbeat: Date.now(),
    };

    this.clients.set(clientId, client);
    console.log(
      `🔌 Client connected: ${clientId} (${this.clients.size} total)`
    );

    this.send(client, {
      t: "event",
      evt: "connection:established",
      data: { clientId },
    });

    ws.on("message", (data) => this.handleMessage(client, data));
    ws.on("close", () => this.handleDisconnect(client));

    ws.on("error", (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      try {
        this.sendError(client, {
          code: "CONNECTION_ERROR",
          message: "WebSocket connection error",
        });
      } catch (e) {
        // Client may already be disconnected
      }
      this.handleDisconnect(client);
    });
  }

  private async handleMessage(client: SocketClient, data: any): Promise<void> {
    try {
      const message: SocketMessage = JSON.parse(data.toString());
      client.lastHeartbeat = Date.now();

      if (message.t === "heartbeat" && message.evt === "ping") {
        this.send(client, {
          t: "heartbeat",
          evt: "pong",
          data: { timestamp: Date.now() } as HeartbeatPayload,
        });
        return;
      }

      if (message.t === "auth" && message.evt === "login") {
        await this.handleAuth(client, message.data);
        return;
      }

      let shouldContinue = true;
      for (const middleware of this.middlewares) {
        await new Promise<void>((resolve) => {
          middleware(client, message, () => {
            resolve();
          });
        });
      }

      if (message.t === "event") {
        const handlers = this.handlers.get(message.evt) || [];
        for (const handler of handlers) {
          try {
            await handler(client, message.data);
          } catch (handlerError: any) {
            console.error(`Error in handler for ${message.evt}:`, handlerError);
            this.sendError(client, {
              code: "HANDLER_ERROR",
              message: handlerError.message || "Error processing event",
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Error handling message:", error);
      this.sendError(client, {
        code: "INVALID_MESSAGE",
        message: error.message || "Failed to process message",
      });
    }
  }

  private async handleAuth(client: SocketClient, data: any): Promise<void> {
    try {
      const userId = await verifyAuthPayload(data);

      if (userId) {
        client.authenticated = true;
        client.userId = userId;

        this.send(client, {
          t: "auth",
          evt: "success",
          data: { userId },
        });

        console.log(`✅ Client ${client.id} authenticated as ${userId}`);
      } else {
        this.send(client, {
          t: "auth",
          evt: "failed",
          data: {
            code: "AUTH_FAILED",
            message: "Authentication failed",
          } as ErrorPayload,
        });

        setTimeout(() => {
          if (!client.authenticated) {
            client.ws.close();
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Auth error:", error);
      this.sendError(client, {
        code: "AUTH_ERROR",
        message: "Authentication error",
      });
    }
  }

  private handleDisconnect(client: SocketClient): void {
    this.clients.delete(client.id);
    console.log(
      `🔌 Client disconnected: ${client.id} (${this.clients.size} remaining)`
    );

    const handlers = this.handlers.get("disconnect") || [];
    for (const handler of handlers) {
      handler(client, {});
    }
  }

  public on<T extends SocketEventName>(
    event: T,
    handler: SocketEventHandler<SocketEventData<T>>
  ): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler as SocketEventHandler);
  }

  public use(middleware: SocketMiddleware): void {
    this.middlewares.push(middleware);
  }

  public send<T extends SocketEventName>(
    client: SocketClient,
    message: SocketMessage<SocketEventData<T>>
  ): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  public sendError(client: SocketClient, error: ErrorPayload): void {
    this.send(client, {
      t: "error",
      evt: "error",
      data: error,
    });
  }

  public broadcastError(error: ErrorPayload): void {
    const message: SocketMessage = {
      t: "error",
      evt: "error",
      data: error,
    };

    for (const client of this.clients.values()) {
      if (client.authenticated) {
        this.send(client, message);
      }
    }
  }

  public broadcast<T extends SocketEventName>(
    event: T,
    data: SocketEventData<T>,
    filter?: (client: SocketClient) => boolean
  ): void {
    const message: SocketMessage = {
      t: "event",
      evt: event,
      data,
    };

    for (const client of this.clients.values()) {
      if (client.authenticated && (!filter || filter(client))) {
        this.send(client, message);
      }
    }
  }

  public sendToUser<T extends SocketEventName>(
    userId: string,
    event: T,
    data: SocketEventData<T>
  ): void {
    for (const client of this.clients.values()) {
      if (client.userId === userId) {
        this.send(client, {
          t: "event",
          evt: event,
          data,
        });
      }
    }
  }

  public getClient(clientId: string): SocketClient | undefined {
    return this.clients.get(clientId);
  }

  public getAuthenticatedClients(): SocketClient[] {
    return Array.from(this.clients.values()).filter((c) => c.authenticated);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      for (const client of this.clients.values()) {
        if (client.ws.readyState === WebSocket.OPEN) {
          this.send(client, {
            t: "heartbeat",
            evt: "ping",
            data: { timestamp: Date.now() } as HeartbeatPayload,
          });
        }
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();

      for (const client of this.clients.values()) {
        if (now - client.lastHeartbeat > this.HEARTBEAT_TIMEOUT) {
          console.log(`⚠️ Client ${client.id} timed out, closing connection`);
          client.ws.close();
          this.clients.delete(client.id);
        }
      }
    }, this.CLEANUP_INTERVAL);
  }

  public shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    for (const client of this.clients.values()) {
      client.ws.close();
    }

    this.clients.clear();
    this.wss?.close();

    console.log("🔌 WebSocket server shutdown");
  }
}

export const socketServer = new SocketServer();
