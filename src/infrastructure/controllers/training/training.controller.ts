import { Controller, Get, Put, Post, Delete, Query, Body, UsePipes, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { TrainingService } from 'src/usecase/services/training/training.service';
import { createTrainingValidator, updateTrainingValidator } from './training.validator';
import { Training, UpdateTraining } from 'src/domain/training/dto/training.dto';

@Controller('training')
@ApiTags('Training')
@ApiBearerAuth()
export class TrainingController {

    constructor(private TrainingService: TrainingService) { }


    /**
     *Create a new Training 
     *
     * @param {Training} Training
     * @return {*}  {Promise<GenericResponse<Training>>}
     * @memberof TrainingController
     */
    @Post('')
    @UsePipes(new JoiValidationPipe(createTrainingValidator)) //validating the object
    public async create(@Body() Training: Training): Promise<GenericResponse<Training>> {
        console.log("Training ===>", Training);
        return this.TrainingService.create(Training);
    }


    /**
     *Get all available Trainings
     *
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<Training[]>>}
     * @memberof TrainingController
     */
    @Post('/get')
    public async getAll(@Query('offset') offset: number, @Query('page') page: number): Promise<GenericResponse<Training[]>> {
        return this.TrainingService.getAll(page, offset);
    }


    /**
     *Get specific Training  by id
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<Training>>}
     * @memberof TrainingController
     */
    @Get('/:id')
    public async getOne(@Param('id') _id: string): Promise<GenericResponse<Training>> {
        return this.TrainingService.getOne(_id);
    }


    /**
     *Update an existing Training 
     *
     * @param {UpdateTraining} updateTraining
     * @return {*}  {Promise<GenericResponse<Training>>}
     * @memberof TrainingController
     */
    @Put('')
    @UsePipes(new JoiValidationPipe(updateTrainingValidator)) //validating the object
    public async update(@Body() updateTraining: UpdateTraining): Promise<GenericResponse<Training>> {
        return this.TrainingService.update(updateTraining);
    }


    /**
     *Delete an existing Training 
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof TrainingController
     */
    @Delete('/')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        return this.TrainingService.delete(id);
    }

}
