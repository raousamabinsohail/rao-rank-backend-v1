import { Schema } from "mongoose";


export const CommentSchema = new Schema({
    data_id: {
        type: Schema.Types.ObjectId,
        ref: "Data"
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    ou: {
        type: Schema.Types.ObjectId,
        ref: "Organizational-Unit",
    },
    text: {
        type: String
    },
    like: {
        type: Boolean
    },
    by: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    approved_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    rejectReason: {
        type: String,
    },
    uid: {
        type: String
    }
},
    { strict: false, timestamps: true })