import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { Permission, UpdatePermissionDto } from 'src/domain/permission/dto/permission.dto';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { PermissionService } from 'src/usecase/services/permission/permission.service';

/**
 *Permission Controller 
 *
 * @export
 * @class PermissionController
 */
@Controller('permission')
@ApiTags('Permission')
@ApiBearerAuth()
export class PermissionController {


    /**
     * Creates an instance of PermissionController.
     * @param {PermissionService} permissionService
     * @memberof PermissionController
     */
    constructor(private permissionService: PermissionService) { }


    /**
     *Get all permissions
     *
     * @return {*}  {Promise<GenericResponse<Permission[]>>}
     * @memberof PermissionController
     */
    @Get('')
    @Secured('PERMISSION_MANAGEMENT','r')
    public async getAll(): Promise<GenericResponse<Permission[]>> {
        return this.permissionService.getAll();
    }


    /**
     *Create new permission
     *
     * @param {Permission} permission
     * @return {*}  {Promise<GenericResponse<Permission>>}
     * @memberof PermissionController
     */
    @Post('')
    @Secured('PERMISSION_MANAGEMENT','c')
    public async create(@Body() permission: Permission): Promise<GenericResponse<Permission>> {
        return this.permissionService.create(permission);
    }


    /**
     *Update a permission
     *
     * @param {UpdatePermissionDto} permission
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof PermissionController
     */
    @Put('')
    @Secured('PERMISSION_MANAGEMENT','u')
    public async update(@Body() permission: UpdatePermissionDto): Promise<GenericResponse<null>> {
        return this.permissionService.update(permission);
    }


    /**
     *Delete a permission
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof PermissionController
     */
    @Delete('/:id')
    @Secured('PERMISSION_MANAGEMENT','d')
    public async delete(@Param('id') id: string): Promise<GenericResponse<null>> {
        return this.permissionService.delete(id);
    }
}
