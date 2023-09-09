import { UpdateWriteOpResult } from "mongoose";
import { Survey, UpdateSurveyDto } from "../dto/survey.dto";



/**
 *Survey repository registerable interface
 *
 * @export
 * @interface SurveyRepository
 */
export interface SurveyRepository {
    incrementAttempt(_id:string): Promise<UpdateWriteOpResult>;
    create(survey: Survey): Promise<Survey>;
    update(survey: UpdateSurveyDto): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
    getAll(): Promise<Survey[]>;
    findById(id:string):Promise<Survey>;
    bulkDelete(ids:string[]):Promise<any>;
}