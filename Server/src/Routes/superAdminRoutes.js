import express from "express";
import { check } from "express-validator";
import auth from "../Middlewares/auth.js";
import superAdminController from "../Controllers/superAdminController.js";

const router = express.Router();

router.post(
  "/assign-admin",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("campusId").notEmpty().withMessage("Campus ID is required")
  ],
  superAdminController.assignAdmin
);

router.get(
  "/partnerships",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  superAdminController.getAllPartnerships
);

export default router;