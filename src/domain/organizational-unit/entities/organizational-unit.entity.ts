import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * @schema Organizational Unit 
 */
export const OrganizationUnitsSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Organizational-Unit",
            default: null
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "OU-Category"
        },
        type: {
            type: Schema.Types.ObjectId,
            ref: "OU-Type"
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: "OU-Location"
        },
        image: {
            type: String,
        },
        image_sq: {
            type: String,
        },
        isManager: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
        id: {
            type: Number,
            unique: true,
        }
    },
    { strict: false, timestamps: true }
);