import express from "express";
import cors from "cors";
import router from "./routers/index.router.js";
import compression from "compression";
import helmet from "helmet";

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

export default app;
