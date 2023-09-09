import { Model, UpdateWriteOpResult } from "mongoose";
import { Survey, UpdateSurveyDto } from "../dto/survey.dto";
import { SurveyRepository } from "../interfaces/survey-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";


/**
 *Survey Repository
 *
 * @export
 * @class SurveyRepositoryImpl
 * @implements {SurveyRepository}
 */
@Injectable()
export class SurveyRepositoryImpl implements SurveyRepository {


    /**
     * Creates an instance of SurveyRepositoryImpl.
     * @param {Model<Survey>} surveyModel
     * @memberof SurveyRepositoryImpl
     */
    constructor(@InjectModel('survey') private readonly surveyModel: Model<Survey>
    ) { }

    
    findById(id: string): Promise<Survey> {
        return this.surveyModel.findById(id).populate('type');
    }

    /**
     *Create a new survey
     *
     * @param {Survey} survey
     * @return {*}  {Promise<Survey>}
     * @memberof SurveyRepositoryImpl
     */
    create(survey: Survey): Promise<Survey> {
        let [day, month, year] = survey.startDate.split('-');
        let [endDay, endMonth, endYear] = survey.endDate.split('-');
        let today = new Date();
        if (today.getDate() >= Number(day) && (today.getMonth() + 1) >= Number(month) && today.getFullYear() >= Number(year)) {
            if (today.getDate() >= Number(endDay) && (today.getMonth() + 1) >= Number(endMonth) && today.getFullYear() >= Number(endYear)) {
                survey.status = 'Closed';
            } else {
                survey.status = 'Active';
            }
        } else {
            survey.status = 'Pending'
        }
        return this.surveyModel.create(survey);
    }

    /**
     *Update an existing survey
     *
     * @param {UpdateSurveyDto} survey
     * @return {*}  {Promise<UpdateWriteOpResult>}
     * @memberof SurveyRepositoryImpl
     */
    update(survey: UpdateSurveyDto): Promise<UpdateWriteOpResult> {
        let _id = survey._id;
        delete survey._id;
        let [day, month, year] = survey.startDate.split('-');
        let [endDay, endMonth, endYear] = survey.endDate.split('-');
        let today = new Date();
        if (today.getDate() >= Number(day) && (today.getMonth() + 1) >= Number(month) && today.getFullYear() >= Number(year)) {
            if (today.getDate() >= Number(endDay) && (today.getMonth() + 1) >= Number(endMonth) && today.getFullYear() >= Number(endYear)) {
                survey.status = 'Closed';
            } else {
                survey.status = 'Active';
            }
        } else {
            survey.status = 'Pending'
        }
        return this.surveyModel.updateOne({ _id }, { $set: survey })
    }

    async incrementAttempt(_id: string): Promise<UpdateWriteOpResult> {
        let survey = await this.surveyModel.findById(_id);
        return this.surveyModel.updateOne({ _id }, { $set: { attempts: (survey.attempts + 1) } })
    }

    /**
     *Delete an existing survey
     *
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof SurveyRepositoryImpl
     */
    delete(_id: string): Promise<any> {
        return this.surveyModel.deleteOne({ _id })
    }

    bulkDelete(ids:string[]):Promise<any> {
        return this.surveyModel.deleteMany({ _id: { $in: ids } });
    }

    /**
     *Get all surveys
     *
     * @return {*}  {Promise<Survey[]>}
     * @memberof SurveyRepositoryImpl
     */
    getAll(): Promise<Survey[]> {
        return this.surveyModel.find().populate('type').populate('attendees');
    }

}