import { Model, UpdateWriteOpResult } from "mongoose";
import { SurveyType, UpdateSurveyTypeDto } from "../dto/survey-type.dto";
import { SurveyTypeRepository } from "../interfaces/survey-type-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";


/**
 *Survey Type Repository
 *
 * @export
 * @class SurveyTypeRepositoryImpl
 * @implements {SurveyTypeRepository}
 */
@Injectable()
export class SurveyTypeRepositoryImpl implements SurveyTypeRepository {


    /**
     * Creates an instance of SurveyTypeRepositoryImpl.
     * @param {Model<SurveyType>} surveyTypeModel
     * @memberof SurveyTypeRepositoryImpl
     */
    constructor(@InjectModel('survey-type') private readonly surveyTypeModel: Model<SurveyType>) { }


    async getAllCategorized() {
        let pipe = [
            {
                $lookup: {
                    from: 'surveys',
                    localField: '_id',
                    foreignField: 'type',
                    as: 'surveys'
                }
            },
            {
                $lookup: {
                    from: 'survey-type',
                    localField: 'surveys.type',
                    foreignField: '_id',
                    as: 'type'
                }
            }
        ];
        return this.surveyTypeModel.aggregate(pipe);
    }



    /**
     *Create a new survey type
     *
     * @param {SurveyType} surveyType
     * @return {*}  {Promise<SurveyType>}
     * @memberof SurveyTypeRepositoryImpl
     */
    create(surveyType: SurveyType): Promise<SurveyType> {
        return this.surveyTypeModel.create(surveyType)
    }


    /**
     *Update an existing survey type
     *
     * @param {UpdateSurveyTypeDto} surveyType
     * @return {*}  {Promise<UpdateWriteOpResult>}
     * @memberof SurveyTypeRepositoryImpl
     */
    update(surveyType: UpdateSurveyTypeDto): Promise<UpdateWriteOpResult> {
        let _id = surveyType._id;
        delete surveyType._id;
        return this.surveyTypeModel.updateOne({ _id }, { $set: surveyType })
    }


    /**
     *Delete an existing survey type
     *
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof SurveyTypeRepositoryImpl
     */
    delete(_id: string): Promise<any> {
        return this.surveyTypeModel.deleteOne({ _id });
    }


    /**
     *Get all survey types
     *
     * @return {*}  {Promise<SurveyType[]>}
     * @memberof SurveyTypeRepositoryImpl
     */
    getAll(): Promise<SurveyType[]> {
        return this.surveyTypeModel.find();
    }

}