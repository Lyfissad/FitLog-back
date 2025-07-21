// test-db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
})();
