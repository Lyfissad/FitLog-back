import mongoose from "mongoose";



const measurementSchema = new mongoose.Schema({
    type: { type:String, required: true },
    value: { type:Number, required: true },
    unit: { type: String, required:true },
    date: { type: date, default: Date.now },
    note: { type: String }
})


export default measurementSchema