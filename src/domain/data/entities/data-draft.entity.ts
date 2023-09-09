import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * @schema Data Draft
 */
export const DataDraftSchema = new mongoose.Schema(
    {
       
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        object: {
            type: Object,
        },
    },
    { strict: false, timestamps:true }
);
