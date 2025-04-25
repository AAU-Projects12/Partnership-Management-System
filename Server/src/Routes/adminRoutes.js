import express from "express";
import { check } from "express-validator";
import auth from "../Middlewares/auth.js";
import adminController from "../Controllers/adminController.js";

const router = express.Router();

router.post(
  "/approve-user",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [check("userId").isMongoId().withMessage("Invalid user ID")],
  adminController.approveUser
);

router.post(
  "/reject-user",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [check("userId").isMongoId().withMessage("Invalid user ID")],
  adminController.rejectUser
);

export default router;