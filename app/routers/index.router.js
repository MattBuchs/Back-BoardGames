import express from "express";
import authController from "../controllers/auth.controller.js";
import contactController from "../controllers/contact.controller.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/signin").post(authController.signin);
router.route("/send-email").post(contactController.email);

export default router;
