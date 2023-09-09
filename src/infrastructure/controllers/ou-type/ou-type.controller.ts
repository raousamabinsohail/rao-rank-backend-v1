import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { OUType, UpdateOUType } from 'src/domain/ou-type/dto/ou-type.dto';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { OuTypeService } from 'src/usecase/services/ou-type/ou-type.service';



/**
 *OU Type Controllers
 *
 * @export
 * @class OuTypeController
 */
@Controller('ou-type')
@ApiTags('OU Type')
@ApiBearerAuth()
export class OuTypeController {


    /**
     * Creates an instance of OuTypeController.
     * @param {OuTypeService} ouTypeService
     * @memberof OuTypeController
     */
    constructor(private ouTypeService: OuTypeService) { }


    /**
     *Create new ou type
     *
     * @param {OUType} ouCategory
     * @return {*}  {Promise<GenericResponse<OUType>>}
     * @memberof OuTypeController
     */
    @Post('')
    @Secured('OU_TYPE', 'c')
    public async create(@Body() ouCategory: OUType): Promise<GenericResponse<OUType>> {
        return this.ouTypeService.create(ouCategory);
    }


    /**
     *Get all ou types
     *
     * @return {*}  {Promise<GenericResponse<OUType[]>>}
     * @memberof OuTypeController
     */
    @Get('')
    @Secured('OU_TYPE', 'r')
    public async getAll(): Promise<GenericResponse<OUType[]>> {
        return this.ouTypeService.getAll();
    }


    /**
     *Update an existing ou type
     *
     * @param {UpdateOUType} updateOUType
     * @return {*}  {Promise<GenericResponse<OUType>>}
     * @memberof OuTypeController
     */
    @Put('')
    @Secured('OU_TYPE', 'u')
    public async update(@Body() updateOUType: UpdateOUType): Promise<GenericResponse<OUType>> {
        return this.ouTypeService.update(updateOUType);
    }


    /**
     *Delete an existing ou type
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof OuTypeController
     */
    @Delete('/:id')
    @Secured('OU_TYPE', 'd')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        return this.ouTypeService.delete(id);
    }
}
