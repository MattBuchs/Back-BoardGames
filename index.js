import "./app/helpers/env.load.js";
import { createServer } from "node:http";
import logger from "./app/helpers/logger.js";
import app from "./app/index.app.js";
import { Server } from "socket.io";
import { checkersSocket } from "./app/services/checkers.socket.js";

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // L'origine de votre client
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

checkersSocket(io);

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
    logger.info(`Server launched on http://localhost:${PORT}`);
});
