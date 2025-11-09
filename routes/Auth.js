import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import bcrypt, { hash } from "bcrypt"


const router = express.Router();



//Sign up route


router.post("/signup", async (req, res) => {
    try{
      const {name, email, password, cPassword} = req.body

      if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required for account"})
      }
      if(password !== cPassword){
        return res.status(400).json({message: "Passwords don't match"})
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


//Login Route

router.post("/login", async (req,res) => {
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


export default router
