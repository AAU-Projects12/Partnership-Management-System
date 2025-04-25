import express from "express";
import { approveUser, changeUserRole } from "../Controller/user.controller.js";

const router = express.Router();

//Some middleware here
//router.use(protect);

router.patch("/:id/approve", approveUser);
router.put("/:id/role", changeUserRole);

export default router;
