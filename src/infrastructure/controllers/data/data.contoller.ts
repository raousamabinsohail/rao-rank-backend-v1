import { Controller, Get, Put, Post, Delete, Query, Body, UsePipes, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Data, UpdateData } from 'src/domain/data/dto/data.dto';
import { GenericResponse } from 'src/domain/dto/generic';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { DataService } from 'src/usecase/services/data/data.service';
import { createDateTemplateValidator, signDataValidator, updateDataValidator } from './data.validations';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';



/**
 *Data Controllers
 *
 * @export
 * @class DataController
 */
@Controller('data')
@ApiTags('Data')
@ApiBearerAuth()
export class DataController {

    constructor(private DataService: DataService) { }

    
    /**
     *Create new data
     *
     * @param {Data} data
     * @return {*}  {Promise<GenericResponse<Data>>}
     * @memberof DataController
     */
    @Post('')
    @Secured('DATA', 'c')
    @UsePipes(new JoiValidationPipe(createDateTemplateValidator)) //validating the object
    public async create(@Body() data: Data): Promise<GenericResponse<Data>> {
        return this.DataService.create(data);
    }


    /**
     *Get data sequence
     *
     * @return {*}  {Promise<GenericResponse<Data[]>>}
     * @memberof DataController
     */
    @Get('/sequence')
    @Secured('DATA', 'r')
    public async getSequence(): Promise<GenericResponse<Data[]>> {
        return this.DataService.getSequence();
    }


    /**
     *Bulk upload data
     *
     * @param {Array<Data>} data
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof DataController
     */
    @Post('/bulkupload')
    @Secured('DATA_BULK', 'a')
    public async bulkUpload(@Body() data: Array<Data>): Promise<GenericResponse<any>> {
        return this.DataService.bulkUpload(data);
    }


    /**
     *Get Data View
     *
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<Data[]>>}
     * @memberof DataController
     */
    @Get('/data-view')
    @Secured('DATA', 'r')
    public async getViewData(@Query('offset') offset: number, @Query('page') page: number): Promise<GenericResponse<Data[]>> {
        return this.DataService.getViewData(page, offset);
    }


    /**
     *Get Content Update Logs
     *
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<Data[]>>}
     * @memberof DataController
     */
    @Get('/view-content-updates')
    @Secured('CONTENT_UPDATE_LOGS', 'r')
    public async getContentUpdateView(@Query('offset') offset: number, @Query('page') page: number): Promise<GenericResponse<Data[]>> {
        return this.DataService.getContentUpdateView(page, offset);
    }

    //Get Populated Template by providing filter
    // @Post('/get/populated')
    // // @UsePipes(new JoiValidationPipe(dateTemplateFilterValidator)) //validating the object
    // public async getPopulatedData(
    //         @Body() filter: Data,
    //         @Query('offset') offset: number, @Query('page') page: number
    //     ): Promise<GenericResponse<Data[]>> {
    //     return this.DataService.getPopulatedData(filter,page,offset);
    // }


    //Get Populated Template by providing filter
    // @Post('/get/data')
    // // @UsePipes(new JoiValidationPipe(dateTemplateFilterValidator)) //validating the object
    // public async getAllDatasDataCreation(
    //         @Body() filter: Data,
    //         @Query('offset') offset: number, @Query('page') page: number
    //     ): Promise<GenericResponse<Data[]>> {
    //         console.log("Value ==>0.1 ")
    //     return this.DataService.getAllDatasDataCreation(filter,page,offset);
    // }



    // @Get('/:id')
    // public async getOne(@Param('id') _id:string): Promise<GenericResponse<Data>> {
    //     return this.DataService.getOne(_id);
    // }


    @Put('')
    @UsePipes(new JoiValidationPipe(updateDataValidator)) //validating the object
    public async update(@Body() updateData: UpdateData): Promise<GenericResponse<Data>> {
        return this.DataService.update(updateData);
    }


    @Put('/sign-data')
    @UsePipes(new JoiValidationPipe(signDataValidator)) //validating the object
    public async signData(@Body() updateData: UpdateData): Promise<GenericResponse<Data>> {
        return this.DataService.signData(updateData);
    }

    @Get('service-count')
    @UsePipes(new JoiValidationPipe(updateDataValidator)) //validating the object
    public async serviceCount(): Promise<GenericResponse<Data>> {
        return this.DataService.servieCount();
    }
    // @Delete('/:id')
    // public async delete(@Query('id') id: string): Promise<GenericResponse<any>> {
    //     return this.DataService.delete(id);
    // }

}
