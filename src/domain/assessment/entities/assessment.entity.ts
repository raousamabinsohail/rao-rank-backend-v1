import mongoose from "mongoose";



export const AssessmentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
    },
})