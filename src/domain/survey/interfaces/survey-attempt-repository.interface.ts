import { SurveyAttempt } from "../dto/survey-attempt.dto";


export interface SurveyAttemptRepository {
    save(surveyAttempt:SurveyAttempt):Promise<SurveyAttempt>;
    totalCount():Promise<number>;
}