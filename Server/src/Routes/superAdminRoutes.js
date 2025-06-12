import express from "express";
import { check } from "express-validator";
import auth from "../Middlewares/auth.js";
import superAdminController from "../Controllers/superAdminController.js";

const router = express.Router();

router.post(
  "/assign-user",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("campusId").notEmpty().withMessage("Campus ID is required"),
    check("role")
      .isIn(["Super-Admin", "Admin", "User"])
      .withMessage("Invalid role"),
  ],
  superAdminController.assignAdmin
);

router.get(
  "/partnerships",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  superAdminController.getAllPartnerships
);

router.put(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  [
    check("firstName").optional().notEmpty().withMessage("First name is required"),
    check("lastName").optional().notEmpty().withMessage("Last name is required"),
    check("email").optional().isEmail().withMessage("Valid email is required"),
    check("role")
      .optional()
      .isIn(["Super-Admin", "Admin", "User"])
      .withMessage("Invalid role"),
  ],
  superAdminController.updateUser
);

router.delete(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("SuperAdmin"),
  superAdminController.deleteUser
);

export default router;