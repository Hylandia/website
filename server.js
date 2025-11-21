const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);

      if (
        url.pathname === "/api/v1/socket" &&
        req.headers.upgrade === "websocket"
      ) {
        await handle(req, res);
        return;
      }

      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  httpServer.on("upgrade", async (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/v1/socket") {
      try {
        const socketModule = await import("./src/lib/socket/index.ts");

        const { socketServer } = socketModule.default || socketModule;

        if (!socketServer) {
          console.error(
            "socketServer is undefined. Module exports:",
            Object.keys(socketModule),
            "Default exports:",
            socketModule.default ? Object.keys(socketModule.default) : "none"
          );
          throw new Error("Failed to import socketServer");
        }

        if (!socketServer.isInitialized()) {
          socketServer.initialize(httpServer);

          await import("./src/lib/socket/handlers.ts");
        }

        socketServer.handleUpgrade(req, socket, head);
      } catch (error) {
        console.error("WebSocket upgrade error:", error);
        socket.destroy();
      }
    } else {
      socket.destroy();
    }
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(
        `> WebSocket server ready at ws://${hostname}:${port}/api/v1/socket`
      );
    });
});
