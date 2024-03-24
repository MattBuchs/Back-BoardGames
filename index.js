import "./app/helpers/env.load.js";
import { createServer } from "node:http";
import logger from "./app/helpers/logger.js";
import app from "./app/index.app.js";

const server = createServer(app);

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
    logger.info(`Server launched on http://localhost:${PORT}`);
});
