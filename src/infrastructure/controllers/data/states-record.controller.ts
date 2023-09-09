import { Controller, Get, Put, Post, Delete, Query, Body, UsePipes, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { States, UpdateStates } from 'src/domain/data/dto/states-records.dto';
import { createStatesValidator, updateStatesValidator } from './data.validations';
import { StatesService } from 'src/usecase/services/data/states-record.service';


@Controller('states')
@ApiTags('Data States')
@ApiBearerAuth()
export class StatesController {

    constructor(private StatesService: StatesService) { }


    /**
     *Create a new State
     *
     * @param {States} data
     * @return {*}  {Promise<GenericResponse<States>>}
     * @memberof StatesController
     */
    @Post('')
    @UsePipes(new JoiValidationPipe(createStatesValidator)) //validating the object
    @Secured('DATA_TYPE', 'c')
    public async create(@Body() data: States): Promise<GenericResponse<States>> {
        return this.StatesService.create(data);
    }


    /**
     *Get all available States
     *
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<States[]>>}
     * @memberof StatesController
     */
    @Post('/get')
    // @Secured('DATA_TYPE', 'r')
    public async getAll(@Query('offset') offset: number, @Query('page') page: number): Promise<GenericResponse<States[]>> {
        return this.StatesService.getAll(page, offset);
    }


    /**
     *Get specific States by id
     *
     * @param {string} _id
     * @return {*}  {Promise<GenericResponse<States>>}
     * @memberof StatesController
     */
    @Get('/:id')
    public async getOne(@Param('id') _id: string): Promise<GenericResponse<States>> {
        return this.StatesService.getOne(_id);
    }


    /**
     *Update an existing State
     *
     * @param {UpdateStates} updateStates
     * @return {*}  {Promise<GenericResponse<States>>}
     * @memberof StatesController
     */
    @Put('')
    @UsePipes(new JoiValidationPipe(updateStatesValidator)) //validating the object
    public async update(@Body() updateStates: UpdateStates): Promise<GenericResponse<States>> {
        return this.StatesService.update(updateStates);
    }


    /**
     *Delete an existing States
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof StatesController
     */
    @Delete('/')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        return this.StatesService.delete(id);
    }

}
