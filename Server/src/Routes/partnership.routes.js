import express from "express";
import {
  createPartnership,
  getPartnerships,
  getPartnershipById,
  updatePartnership,
  deletePartnership,
  renewPartnership,
  exportPartnerships,
} from "../Controller/partnership.controller.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createPartnership);
router.get("/", getPartnerships);
router.get("/export", exportPartnerships);
router.get("/:id", getPartnershipById);
router.put("/:id", updatePartnership);
router.delete("/:id", deletePartnership);
router.patch("/:id/renew", renewPartnership);

export default router;
