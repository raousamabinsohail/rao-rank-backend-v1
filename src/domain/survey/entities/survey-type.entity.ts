import mongoose from "mongoose";



export const SurveyTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { strict: true, timestamps: true });