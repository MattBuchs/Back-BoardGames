import express from "express";
import controllerExample from "../controllers/example.controller.js";

const router = express.Router();

router.route("/").get(controllerExample.getExample);

export default router;
