import mongoose from "mongoose";
import { QuestionSchema } from "./survey.entity";


export const SurveyAttemptSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Types.ObjectId,
        ref: 'survey'
    },
    questions: [QuestionSchema]
}, { strict: true, timestamps: true });