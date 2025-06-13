import express from "express";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import superAdminController from "../Controllers/superAdminController.js";

const router = express.Router();

router.post(
  "/assign-user",
  auth.authenticateToken,
  auth.authorizeRoles("Admin"), // Changed from "SuperAdmin" to "Admin"
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("campusId").notEmpty().withMessage("Campus ID is required"),
    check("role").isIn(["Admin", "User"]).withMessage("Invalid role"),
  ],
  superAdminController.assignAdmin
);

router.get(
  "/partnerships",
  auth.authenticateToken,
  auth.authorizeRoles("Admin"), // Changed from "SuperAdmin" to "Admin"
  superAdminController.getAllPartnerships
);

router.put(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("Admin"), // Changed from "SuperAdmin" to "Admin"
  [
    check("firstName").optional().notEmpty().withMessage("First name is required"),
    check("lastName").optional().notEmpty().withMessage("Last name is required"),
    check("email").optional().isEmail().withMessage("Valid email is required"),
    check("role").optional().isIn(["Admin", "User"]).withMessage("Invalid role"),
  ],
  superAdminController.updateUser
);

router.delete(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("Admin"), // Changed from "SuperAdmin" to "Admin"
  superAdminController.deleteUser
);

export default router;