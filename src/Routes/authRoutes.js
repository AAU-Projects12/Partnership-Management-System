import express from "express";
import { logout, signup, login } from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
