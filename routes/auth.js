import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user"



const router = express.Router();



//Sign up route


router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({message: "User Already Exists"})
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({name, email, password: hashedPassword})
        newUser.save()

        return res.status(201).json({message: "User Created"})
    }catch(err){
        res.status(500).json({error: err.message})
    }
})