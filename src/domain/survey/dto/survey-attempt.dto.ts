import { Question } from "./survey.dto";


export class SurveyAttempt {
    surveyId:string;
    questions:Array<Question>;
}