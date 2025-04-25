import { validationResult } from "express-validator";
import User from "../Models/userModel.js";

export const approveUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;
        const query = req.user.role === "SuperAdmin"
         ? { _id: userId }
         : { _id: userId, campusId: req.user.campusId };
        const user = await User.findOne(query);

        if (!user) {
           return res.status(404).json({ error: "User not found or not in your campus" });
        }

        if (user.status === "active") {
           return res.status(400).json({ error: "User already approved" });
        }

        user.status = "active";
         await user.save();
         // TODO: Implement email notification (SRS UC-10)
         res.status(200).json({ message: "User approved successfully" });
       } catch (error) {
         console.error("Error approving user:", error.message, error.stack);
         res.status(500).json({ error: "Server error" });
       }
     };

export const rejectUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;
        const query = req.user.role === "SuperAdmin"
         ? { _id: userId }
         : { _id: userId, campusId: req.user.campusId };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ error: "User not found or not in your campus" });
        }

        if (user.status === "inactive") {
            return res.status(400).json({ error: "User already rejected" });
        }

        user.status = "inactive";
        await user.save();
         // TODO: Implement email notification (SRS UC-10)
        res.status(200).json({ message: "User rejected successfully" });
       } catch (error) {
          console.error("Error rejecting user:", error.message, error.stack);
          res.status(500).json({ error: "Server error" });
       }
     };

export default { approveUser, rejectUser };