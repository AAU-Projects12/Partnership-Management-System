import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log("Decoded JWT:", decoded);

    if (!decoded.id || !decoded.role) {
      console.log("Invalid token: missing id or role");
      return res.status(401).json({ error: "Invalid token: missing id or role" });
    }

    const user = await User.findById(decoded.id);
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (user.status !== "active") {
      console.log("User not active:", user.status);
      return res.status(403).json({ error: "User account not active" });
    }

    // Use decoded.role, but verify it matches DB role
    if (decoded.role !== user.role) {
      console.log(`Role mismatch: JWT role=${decoded.role}, DB role=${user.role}`);
      return res.status(403).json({ error: "Role mismatch in token" });
    }

    req.user = {
      userId: decoded.id,
      role: decoded.role,
      campusId: decoded.campusId
    };
    console.log("req.user set to:", req.user);

    next();
  } catch (error) {
    console.error("Token verification error:", error.message, error.stack);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`Checking roles: user role=${req.user.role}, required=${roles}`);
    // Normalize roles to handle case sensitivity
    const normalizedUserRole = req.user.role ? req.user.role.toLowerCase() : "";
    const normalizedRequiredRoles = roles.map(r => r.toLowerCase());
    if (!normalizedUserRole || !normalizedRequiredRoles.includes(normalizedUserRole)) {
      console.log("Role check failed");
      return res.status(403).json({ error: "Access forbidden: insufficient role" });
    }
    console.log("Role check passed");
    next();
  };
};

export default { authenticateToken, authorizeRoles };