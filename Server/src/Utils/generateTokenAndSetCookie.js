import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// This should come from an environment variable in real apps
const JWT_SECRET = process.env.PRIVATE_KEY;

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "1d",
  });

  // Set token as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export default generateTokenAndSetCookie;
