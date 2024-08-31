import express from "express";
import controllerExample from "../controllers/example.controller.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/").get(controllerExample.getExample);
router.route("/signup").post(authController.signup);
router.route("/signin").post(authController.signin);

export default router;
