import { Controller, Get, Put, Post, Delete, Query, Body, UsePipes, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';

import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { TrainingRequest, UpdateTrainingRequest } from 'src/domain/training/dto/training-request.dto';
import { createTrainingRequestValidator, updateTrainingRequestValidator } from './training.validator';
import { TrainingRequestService } from 'src/usecase/services/training/training-request.service';


@Controller('training-req')
@ApiTags('Training Request')
@ApiBearerAuth()
export class TrainingRequestController {

    constructor(private TrainingRequestService: TrainingRequestService) { }


    /**
     *Create a new TrainingRequest 
     *
     * @param {TrainingRequest} TrainingRequest
     * @return {*}  {Promise<GenericResponse<TrainingRequest>>}
     * @memberof TrainingRequestController
     */
    @Post('')
    @UsePipes(new JoiValidationPipe(createTrainingRequestValidator)) //validating the object
    public async create(@Body() TrainingRequest: TrainingRequest): Promise<GenericResponse<TrainingRequest>> {
        return this.TrainingRequestService.create(TrainingRequest);
    }


    /**
     *Get all available TrainingRequests
     *
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<TrainingRequest[]>>}
     * @memberof TrainingRequestController
     */
    @Post('/get')
    public async getAll(@Query('offset') offset: number, @Query('page') page: number , @Body() filter : TrainingRequest ): Promise<GenericResponse<TrainingRequest[]>> {
        return this.TrainingRequestService.getAll(page, offset, filter);
    }


    /**
     *Get specific TrainingRequest  by id
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<TrainingRequest>>}
     * @memberof TrainingRequestController
     */
    @Get('/:id')
    public async getOne(@Param('id') _id: string): Promise<GenericResponse<TrainingRequest>> {
        return this.TrainingRequestService.getOne(_id);
    }


    /**
     *Update an existing TrainingRequest 
     *
     * @param {UpdateTrainingRequest} updateTrainingRequest
     * @return {*}  {Promise<GenericResponse<TrainingRequest>>}
     * @memberof TrainingRequestController
     */
    @Put('')
    @UsePipes(new JoiValidationPipe(updateTrainingRequestValidator)) //validating the object
    public async update(@Body() updateTrainingRequest: UpdateTrainingRequest): Promise<GenericResponse<TrainingRequest>> {
        return this.TrainingRequestService.update(updateTrainingRequest);
    }


    /**
     *Delete an existing TrainingRequest 
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof TrainingRequestController
     */
    @Delete('/:id')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        console.log("==>Training Request",id)
        return this.TrainingRequestService.delete(id);
    }

}
