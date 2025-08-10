import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt"
import cors from "cors";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { Auth } from "./middleware/verifyToken.js";


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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
});

const User = mongoose.model('User', userSchema, 'Users'); 

app.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.post("/signup", async (req, res) => {
    try{
      const {name, email, password} = req.body

      if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required for account"})
      }
      const existingUser = await User.findOne({ email })

      if (existingUser){
        return res.status(409).json({message: "User already exists"})
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({name, email, password:hashedPassword})

      await newUser.save();

      res.status(201).json({message: "Account created.", user: newUser})

    }catch(err){
      console.error("Signup error")
      console.error(err)
      res.status(400).json({message: "server error while signing up"})
    }
});

app.post("/login", async (req,res) => {
  try{
    const {email, password} = req.body

    if (!email || !password){
      return res.status(400).json({message: "All credentials required for login"})
    }


    const existingUser = await User.findOne({ email })


    if(!existingUser){
      return res.status(404).json({message: "Invalid credentials"})
    }

    const valid = await bcrypt.compare(password, existingUser.password);

    if(valid){
      const token = jwt.sign({id:existingUser.id}, process.env.JWT_SECRET, {expiresIn: "1d"});
      res.cookie("token", token, {
          httpOnly:true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(200).json({message: "Login successful"})
      }
      

    
    if(!valid){
      return res.status(401).json({message: "Incorrect Password"})
    }
  }
  catch(err){
      console.log("Server Login error")
      res.status(400).json({message: "Server login error"})
  }
})


app.get("/profile", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email"); // no password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile loaded",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));