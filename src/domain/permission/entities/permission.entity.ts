import mongoose from "mongoose";


//Child interfaces
const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ouRequired: { type: Boolean, default: false },
    arabic: { type: String },
    ou: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organizational-Unit",
    },
    options: {
        type: {
            type: String,
        },
        options: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
});

//Parent Interface
const parent = new mongoose.Schema({
    name: { type: String, required: true },
    ouRequired: { type: Boolean, default: false },
    arabic: { type: String },
    ou: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organizational-Unit",
    },
    ouLabel: {
        type: String
    },
    options: {
        type: {
            type: String,
        },
        options: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    children: [childSchema],
});

//Main Schema
export const PermissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        permissions: [parent],
        active: {
            type: Boolean,
            default: true,
        },
    },
    { strict: false, timestamps: true }
);