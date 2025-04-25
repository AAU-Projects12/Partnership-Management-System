import express from "express";
import { check } from "express-validator";
import auth from "../Middlewares/auth.js";
import partnershipController from "../Controllers/partnershipController.js";

const router = express.Router();

router.post(
  "/",
  auth.authenticateToken,
  auth.authorizeRoles("User", "Admin", "SuperAdmin"),
  [
    check("partnersName").notEmpty().withMessage("Partner name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("region").notEmpty().withMessage("Region is required"),
    check("category").notEmpty().withMessage("Category is required"),
    check("phoneNumber").notEmpty().withMessage("Phone number is required"),
    check("inceptionDate").isISO8601().withMessage("Valid inception date is required"),
    check("expiringDate").isISO8601().withMessage("Valid expiring date is required"),
    check("aauLeadContact").notEmpty().withMessage("AAU lead contact is required"),
    check("partnerLeadContact").notEmpty().withMessage("Partner lead contact is required"),
    check("MOUFile").notEmpty().withMessage("MOU file is required"),
    check("type").notEmpty().withMessage("Type is required"),
  ],
  partnershipController.createPartnership
);

router.get(
  "/",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  partnershipController.getPartnerships
);
router.get(
  "/export",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  partnershipController.exportPartnerships
);

router.get(
  "/:id",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [check("id").isMongoId().withMessage("Invalid partnership ID")],
  partnershipController.getPartnershipById
);

router.put(
  "/:id",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [check("id").isMongoId().withMessage("Invalid partnership ID")],
  partnershipController.updatePartnership
);

router.delete(
  "/:id",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [check("id").isMongoId().withMessage("Invalid partnership ID")],
  partnershipController.deletePartnership
);

router.patch(
  "/:id/renew",
  auth.authenticateToken,
  auth.authorizeRoles("Admin", "SuperAdmin"),
  [
    check("id").isMongoId().withMessage("Invalid partnership ID"),
    check("expiringDate").isISO8601().withMessage("Valid expiring date is required"),
    check("MOUFile").notEmpty().withMessage("MOU file is required"),
  ],
  partnershipController.renewPartnership
);


export default router;