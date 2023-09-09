import mongoose from "mongoose";
import { SurveyTypeSchema } from "./survey-type.entity";


export const QuestionSchema = new mongoose.Schema({
    questionCode: {
        type: String,
    },
    questionText: {
        type: String,
    },
    type: {
        type: String,
        default: null
    },
    pageBreak: {
        type: Boolean,
        default: false
    },
    separator: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    meta: {
        type: Object
    }
}, { strict: true, timestamps: true });

export const SurveySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    type: [{
        type: mongoose.Types.ObjectId,
        ref: 'survey-type'
    }],
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Pending'],
        default: null
    },
    attendees: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    headerImage: {
        type: String,
        default: ''
    },
    footerText: {
        type: String,
        default: ''
    },
    thankyouPageText: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    attempts:{
        type:Number,
        default:0
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    comments: {
        type: String,
        default: ''
    },
    accessType: {
        type: String,
        enum: ['BY_ACCOUNT', 'BY_URL'],
        default: 'BY_ACCOUNT'
    },
    active: {
        type: Boolean,
        default: true
    },
    questions: [QuestionSchema]
}, { strict: true, timestamps: true });

