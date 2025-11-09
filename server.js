import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser"
import { verifyToken } from "./middleware/verifyToken.js";
import User from "./models/user.js";
import authRoutes from "./routes/Auth.js"
import Stripe from "stripe";


dotenv.config()


const app = express();
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URI



app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://fit-log-indol.vercel.app"
  ],
  credentials: true,
}));


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));



app.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



app.use("/auth", authRoutes);

app.get("/profile", verifyToken, async (req, res) => {
  console.log("req.user:", req.user); 
  try {
    const user = await User.findById(req.user?.id).select("id name email ");
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile loaded", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/measurement", verifyToken, async (req, res) => {
  console.log("req.user: ", req.user)
  try{
    const {id, type, value, unit, note} = req.body
    const userId = req.user.id

    const newMeasurements = {
      user: id,
      type,
      value,
      unit,
      note,
      date: new Date()
    }

      await User.findByIdAndUpdate(userId,
        {$push: {measurement: newMeasurements}},
        {new: true}
      )
      res.status(200).json({message : "Measurement added"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Failed to add measurement"})
    }
  }
)




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  