import { InjectModel } from "@nestjs/mongoose";
import { SurveyAttempt } from "../dto/survey-attempt.dto";
import { SurveyAttemptRepository } from "../interfaces/survey-attempt-repository.interface";
import { Model } from "mongoose";


export class SurveyAttemptRepositoryImpl implements SurveyAttemptRepository {

    constructor(@InjectModel('survey-attempts') private readonly attemptModel: Model<SurveyAttempt>) { }
    
    totalCount(): Promise<number> {
        return this.attemptModel.countDocuments();
    }

    save(surveyAttempt: SurveyAttempt): Promise<SurveyAttempt> {
        return this.attemptModel.create(surveyAttempt);
    }

}