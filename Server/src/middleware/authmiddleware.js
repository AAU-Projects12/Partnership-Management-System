import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Not authorized" });

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await User.findById(decoded.id);

    if (!user || user.status !== "Active") {
      return res.status(401).json({ error: "Unauthorized or inactive" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access Denied" });
    }
    next();
  };
};
