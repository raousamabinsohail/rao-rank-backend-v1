import mongoose from "mongoose";
const Schema = mongoose.Schema

export const SessionSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
    },
    typeId: {
        type: String,
    },
    date: {
        type: String
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String
    }
},
{ strict: false, timestamps: true }
)