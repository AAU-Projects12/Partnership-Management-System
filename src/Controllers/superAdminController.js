import { validationResult } from "express-validator";
import User from "../Models/userModel.js";
import Partnership from "../Models/partnershipModel.js";

export const assignAdmin = async (req, res) => {
       try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const { userId, campusId } = req.body;
         const user = await User.findById(userId);

         if (!user) {
           return res.status(404).json({ error: "User not found" });
         }

         if (user.role === "Admin") {
           return res.status(400).json({ error: "User is already an Admin" });
         }

         user.role = "Admin";
         user.campusId = campusId;
         user.status = "active";
         await user.save();
         // TODO: Implement email notification (SRS UC-10)
         res.status(200).json({ message: "Admin assigned successfully" });
       } catch (error) {
         console.error("Error assigning admin:", error.message, error.stack);
         res.status(500).json({ error: "Server error" });
       }
     };

     export const getAllPartnerships = async (req, res) => {
       try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const partnerships = await Partnership.find();
         res.status(200).json(partnerships);
       } catch (error) {
         console.error("Error fetching all partnerships:", error.message, error.stack);
         res.status(500).json({ error: "Server error" });
       }
     };

export default { assignAdmin, getAllPartnerships };