import { socketServer } from "@/lib/socket";
import { requireAuth, rateLimit, logger } from "@/lib/socket/middlewares";

socketServer.use(logger);
socketServer.use(rateLimit(100, 60000));

socketServer.on("connection:established", async (client, data) => {
  console.log(`New connection: ${data.clientId}`);
});

socketServer.on("user:status", async (client, data) => {
  if (!client.authenticated) return;

  socketServer.broadcast("user:status", {
    userId: client.userId!,
    status: data.status,
    timestamp: Date.now(),
  });
});

socketServer.on("game:join", async (client, data) => {
  if (!client.authenticated) {
    socketServer.sendError(client, {
      code: "UNAUTHORIZED",
      message: "Must be authenticated to join games",
    });
    return;
  }

  console.log(`User ${client.userId} joined game ${data.gameId}`);

  client.metadata = {
    ...client.metadata,
    currentGame: data.gameId,
  };

  socketServer.broadcast(
    "game:state",
    {
      gameId: data.gameId,
      state: {
        playerJoined: client.userId,
        timestamp: Date.now(),
      },
    },
    (c) => c.metadata?.currentGame === data.gameId && c.userId !== client.userId
  );
});

socketServer.on("disconnect", async (client, data) => {
  console.log(`Client disconnected: ${client.id}`);

  if (client.metadata?.currentGame) {
    socketServer.broadcast("game:state", {
      gameId: client.metadata.currentGame,
      state: {
        playerLeft: client.userId,
        timestamp: Date.now(),
      },
    });
  }
});

export function handleRuntimeError(error: Error) {
  console.error("Runtime error:", error);

  socketServer.broadcastError({
    code: "RUNTIME_ERROR",
    message:
      "A server error occurred. Please refresh if you experience issues.",
  });
}

console.log("✅ WebSocket handlers registered");
