import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
  }
};

export default db_connection;
