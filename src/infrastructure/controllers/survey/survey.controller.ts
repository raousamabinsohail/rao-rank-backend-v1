import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { Survey, UpdateSurveyDto } from 'src/domain/survey/dto/survey.dto';
import { OpenRoute } from 'src/domain/user-auth/decorators/public-route.decorator';
import { SurveyService } from 'src/usecase/services/survey/survey.service';



/**
 *Survey Request Handlers/Controllers
 *
 * @export
 * @class SurveyController
 */
@Controller('survey')
@ApiBearerAuth()
@ApiTags('Survey')
export class SurveyController {


    /**
     * Creates an instance of SurveyController.
     * @param {SurveyService} surveyService
     * @memberof SurveyController
     */
    constructor(private surveyService: SurveyService) { }


    @Post('submit')
    @OpenRoute()
    public async submitSurvey(@Body() updateSurveyDto: UpdateSurveyDto): Promise<GenericResponse<null>> {
        return this.surveyService.submitSurvey(updateSurveyDto);
    }

    @Post('bulkdelete')
    public async bulkDelete(@Body('ids') ids:string[]):Promise<GenericResponse<null>> {
        return this.surveyService.bulkDelete(ids);
    }
    

    /**
     *Get all surveys
     *
     * @return {*}  {Promise<GenericResponse<Survey[]>>}
     * @memberof SurveyController
     */
    @Get('')
    public async getAll(): Promise<GenericResponse<Survey[]>> {
        return this.surveyService.getAll();
    }

    @Get('/id/:id')
    @OpenRoute()
    public findById(@Param('id') id: string): Promise<GenericResponse<Survey>> {
        return this.surveyService.findById(id);
    }


    /**
     *Create a new survey
     *
     * @param {Survey} survey
     * @return {*}  {Promise<GenericResponse<Survey>>}
     * @memberof SurveyController
     */
    @Post('')
    public async create(@Body() survey: Survey): Promise<GenericResponse<Survey>> {
        return this.surveyService.create(survey);
    }


    /**
     *Update an existing survey
     *
     * @param {UpdateSurveyDto} survey
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyController
     */
    @Put('')
    public async update(@Body() survey: UpdateSurveyDto): Promise<GenericResponse<null>> {
        return this.surveyService.update(survey);
    }


    /**
     *Delete an existing survey
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof SurveyController
     */
    @Delete('/:id')
    public async delete(@Param('id') _id: string): Promise<GenericResponse<null>> {
        return this.surveyService.delete(_id);
    }
}
