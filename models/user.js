import mongoose from "mongoose";
import measurementSchema from "./measurement.js";


const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    measurements: [measurementSchema]
});




const User = mongoose.models.User || mongoose.model("User", userSchema, "Users")

export default User