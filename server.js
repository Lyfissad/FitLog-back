import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt"
import cors from "cors";



dotenv.config()


const app = express();
app.use(express.json())
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
      return res.status(404).json({message: "User does not exist."})
    }
    const valid = await bcrypt.compare(password, existingUser.password)


    
  }
})




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));