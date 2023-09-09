import { UpdateWriteOpResult } from "mongoose";
import { SurveyType, UpdateSurveyTypeDto } from "../dto/survey-type.dto";



/**
 *Survey Type repository registerable interface
 *
 * @export
 * @interface SurveyTypeRepository
 */
export interface SurveyTypeRepository {
    create(survey: SurveyType): Promise<SurveyType>;
    update(survey: UpdateSurveyTypeDto): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
    getAll(): Promise<SurveyType[]>;
    getAllCategorized():Promise<any>;
}