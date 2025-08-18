import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    measurements: [
    {
      type: { type: String, required: true }, // e.g., "weight", "waist", "bodyFat"
      value: { type: Number, required: true }, 
      unit: { type: String }, 
      date: { type: Date, default: Date.now },
      note: { type: String }
    }
]
});




const User = mongoose.model("User", userSchema, "Users")

export default User