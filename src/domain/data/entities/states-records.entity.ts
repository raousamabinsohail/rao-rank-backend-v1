import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * @schema States
 */
export const StatesSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        service_id: {
            type: Schema.Types.ObjectId,
            ref: "data",
        },
        keyword: {
            type: String,
        },
        category_id: {
            type: Number,
        }
    },
    { strict: false, timestamps:true }
);
