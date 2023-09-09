import mongoose from "mongoose";
const Schema = mongoose.Schema

export const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
    },
    image: {
        type: String,
    },
    start_Date: {
        type: String
    },
    end_date: {
        type: String
    },
    session: [{
        type: Schema.Types.ObjectId,
        ref: "Session",
    }],
    active: {
        type: Boolean,
        default: true
    },
    courseMaterial: [{
        type: Object
    }],
    status: {
        type: String
    }
}, { strict: false, timestamps: true })