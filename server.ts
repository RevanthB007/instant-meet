import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";

const port = process.env.PORT || "3000";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const userManager = new UserManager();

  io.on("connection", (socket) => {
    console.log("user connected ", socket.id);
    userManager.addUser("name",socket);

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      userManager.removeUser(socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port:${port}`);
  });
});
