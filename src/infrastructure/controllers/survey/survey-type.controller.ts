import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { SurveyType, UpdateSurveyTypeDto } from 'src/domain/survey/dto/survey-type.dto';
import { SurveyTypeService } from 'src/usecase/services/survey/survey-type.service';

@Controller('survey-type')
@ApiBearerAuth()
@ApiTags('Survey Type')
export class SurveyTypeController {

    /**
     * Creates an instance of SurveyTypeController.
     * @param {SurveyTypeService} surveyTypeService
     * @memberof SurveyTypeController
     */
    constructor(private surveyTypeService: SurveyTypeService) { }

    @Get('/categorized')
    public async getAllCategorized():Promise<GenericResponse<any>> {
        return this.surveyTypeService.getAllCategorized();
    }

    /**
     *Get all survey types
     *
     * @return {*}  {Promise<GenericResponse<SurveyType[]>>}
     * @memberof SurveyController
     */
    @Get('')
    public async getAll(): Promise<GenericResponse<SurveyType[]>> {
        return this.surveyTypeService.getAll();
    }


    /**
     *Create a new survey type
     *
     * @param {SurveyType} survey
     * @return {*}  {Promise<GenericResponse<SurveyType>>}
     * @memberof SurveyController
     */
    @Post('')
    public async create(@Body() survey: SurveyType): Promise<GenericResponse<SurveyType>> {
        return this.surveyTypeService.create(survey);
    }


    /**
     *Update an existing survey type
     *
     * @param {UpdateSurveyTypeDto} survey
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyController
     */
    @Put('')
    public async update(@Body() survey: UpdateSurveyTypeDto): Promise<GenericResponse<null>> {
        return this.surveyTypeService.update(survey);
    }


    /**
     *Delete an existing survey type
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyController
     */
    @Delete('/:id')
    public async delete(@Param('id') _id: string): Promise<GenericResponse<null>> {
        return this.surveyTypeService.delete(_id);
    }
}
