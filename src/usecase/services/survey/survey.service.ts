import { Inject, Injectable } from '@nestjs/common';
import { GenericResponse } from 'src/domain/dto/generic';
import { SurveyAttempt } from 'src/domain/survey/dto/survey-attempt.dto';
import { Survey, UpdateSurveyDto } from 'src/domain/survey/dto/survey.dto';
import { SurveyAttemptRepository } from 'src/domain/survey/interfaces/survey-attempt-repository.interface';
import { SurveyRepository } from 'src/domain/survey/interfaces/survey-repository.interface';


/**
 *Survey Service for logics related to survey
 *
 * @export
 * @class SurveyService
 */
@Injectable()
export class SurveyService {


    /**
     * Creates an instance of SurveyService.
     * @param {SurveyRepository} surveyRepository
     * @memberof SurveyService
     */
    constructor(@Inject('SurveyRepository') private surveyRepository: SurveyRepository,
        @Inject('SurveyAttemptRepository') private surveyAttemptRepository: SurveyAttemptRepository
    ) { }


    /**
     *Create a new survey
     *
     * @param {Survey} survey
     * @return {*}  {Promise<GenericResponse<Survey>>}
     * @memberof SurveyService
     */
    public async create(survey: Survey): Promise<GenericResponse<Survey>> {
        let res = await this.surveyRepository.create(survey);
        return {
            message: "Survey created successfully",
            success: true,
            data: res
        }
    }

    public async findById(id: string): Promise<GenericResponse<Survey>> {
        let res = await this.surveyRepository.findById(id);
        if (res) {
            return {
                message: "Survey fetched successfully",
                success: true,
                data: res
            }
        }
        return {
            message: "Failed to fetch survey",
            success: false,
            data: null
        }
    }


    /**
     *Update an existing survey
     *
     * @param {UpdateSurveyDto} survey
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyService
     */
    public async update(survey: UpdateSurveyDto): Promise<GenericResponse<null>> {
        let res = await this.surveyRepository.update(survey);
        if (res.modifiedCount == 0) {
            return {
                message: "failed to update survey",
                success: false,
                data: null
            }
        }
        return {
            message: "Survey updated successfully",
            success: true,
            data: null
        }
    }

    /**
     *Delete an existing survey
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyService
     */
    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.surveyRepository.delete(_id);
        if (res.deletedCount == 0) {
            return {
                message: "failed to delete survey",
                success: false,
                data: null
            }
        }
        return {
            message: "Survey deleted successfully",
            success: true,
            data: null
        }
    }

    public async bulkDelete(ids: string[]): Promise<GenericResponse<null>> {
        let res = await this.surveyRepository.bulkDelete(ids);
        if (res.deletedCount == 0) {
            return {
                message: "failed to delete survey",
                success: false,
                data: null
            }
        }
        return {
            message: "Surveys deleted successfully",
            success: true,
            data: null
        }
    }

    /**
     *Get all surveys
     *
     * @return {*}  {Promise<GenericResponse<Survey[]>>}
     * @memberof SurveyService
     */
    public async getAll(): Promise<GenericResponse<Survey[]>> {
        let res = await this.surveyRepository.getAll();
        return {
            message: "Surveys fetched successfully",
            success: true,
            data: res
        }
    }

    public async submitSurvey(survey: UpdateSurveyDto): Promise<GenericResponse<null>> {

        let surveyId = survey._id;

        let res = await this.surveyRepository.incrementAttempt(surveyId);
        if (res.modifiedCount == 0) {
            return {
                message: "failed to submit survey",
                success: false,
                data: null
            }
        }

        let surveyAttempt: SurveyAttempt = {
            surveyId: surveyId,
            questions: survey.questions
        };

        let saved = await this.surveyAttemptRepository.save(surveyAttempt);

        if (saved) {
            return {
                message: "Survey Submitted successfully",
                success: true,
                data: null
            }
        }

        return {
            message: "failed to submit survey",
            success: false,
            data: null
        }
    }
}
