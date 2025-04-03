import express from "express";
import {
  createPartnership,
  getPartnerships,
  getPartnershipById,
  updatePartnership,
  deletePartnership,
  renewPartnership,
} from "../Controller/partnership.controller.js";

const router = express.Router();

router.post("/", createPartnership);
router.get("/", getPartnerships);
router.get("/:id", getPartnershipById);
router.put("/:id", updatePartnership);
router.delete("/:id", deletePartnership);
router.patch("/:id/renew", renewPartnership);


export default router;
