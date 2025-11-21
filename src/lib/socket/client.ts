import {
  SocketMessage,
  SocketEventName,
  SocketEventData,
  HeartbeatPayload,
} from "./types";
import { createAuthPayload } from "./auth";

type EventCallback<T = any> = (data: T) => void;

export class SocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private lastHeartbeat = 0;
  private eventHandlers: Map<string, EventCallback[]> = new Map();
  private connected = false;

  constructor(url: string = "/api/v1/socket") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    this.url = `${protocol}//${host}${url}`;
  }

  public connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          this.token = token;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("✅ WebSocket connected");
          this.connected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();

          if (this.token) {
            this.authenticate(this.token);
          }

          this.emit("connect", {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = () => {
          console.log("🔌 WebSocket disconnected");
          this.connected = false;
          this.stopHeartbeat();
          this.emit("disconnect", {});
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  private authenticate(token: string): void {
    const authPayload = createAuthPayload(token);
    this.send({
      t: "auth",
      evt: "login",
      data: authPayload,
    });
  }

  private handleMessage(data: string): void {
    try {
      const message: SocketMessage = JSON.parse(data);

      if (message.t === "heartbeat" && message.evt === "pong") {
        this.lastHeartbeat = Date.now();
        return;
      }

      const handlers = this.eventHandlers.get(message.evt) || [];
      for (const handler of handlers) {
        handler(message.data);
      }

      const typeHandlers =
        this.eventHandlers.get(`${message.t}:${message.evt}`) || [];
      for (const handler of typeHandlers) {
        handler(message.data);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  public send<T extends SocketEventName>(
    message: SocketMessage<SocketEventData<T>>
  ): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected");
    }
  }

  public emit<T extends SocketEventName>(
    event: T,
    data: SocketEventData<T>
  ): void {
    this.send({
      t: "event",
      evt: event,
      data: data as any,
    });
  }

  public on<T extends SocketEventName>(
    event: T,
    callback: EventCallback<SocketEventData<T>>
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback as EventCallback);
  }

  public off<T extends SocketEventName>(
    event: T,
    callback?: EventCallback<SocketEventData<T>>
  ): void {
    if (!callback) {
      this.eventHandlers.delete(event);
      return;
    }

    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(callback as EventCallback);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          t: "heartbeat",
          evt: "ping",
          data: { timestamp: Date.now() } as HeartbeatPayload,
        });
      }
    }, 25000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      this.connect(this.token || undefined).catch((error) => {
        console.error("Reconnect failed:", error);
      });
    }, delay);
  }

  public isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }
}
