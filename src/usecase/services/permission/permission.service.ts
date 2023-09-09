import { Inject, Injectable } from '@nestjs/common';
import { GenericResponse } from 'src/domain/dto/generic';
import { Permission, UpdatePermissionDto } from 'src/domain/permission/dto/permission.dto';
import { PermissionRepository } from 'src/domain/permission/interfaces/permission.repository.interface';


/**
 *
 *
 * @export
 * @class PermissionService
 */
@Injectable()
export class PermissionService {


    /**
     * Creates an instance of PermissionService.
     * @param {PermissionRepository} permissionRepository
     * @memberof PermissionService
     */
    constructor(@Inject('PermissionRepository') private permissionRepository: PermissionRepository) { }


    /**
     *Create new permission
     *
     * @param {Permission} permission
     * @return {*}  {Promise<GenericResponse<Permission>>}
     * @memberof PermissionService
     */
    public async create(permission: Permission): Promise<GenericResponse<Permission>> {
        const pResult = await this.permissionRepository.create(permission);
        const res: GenericResponse<Permission> = {
            message: "Permission created successfully",
            success: true,
            data: pResult,
        }
        return res;
    }


    /**
     *Get all permissions
     *
     * @return {*}  {Promise<GenericResponse<Permission[]>>}
     * @memberof PermissionService
     */
    public async getAll(): Promise<GenericResponse<Permission[]>> {
        const data = await this.permissionRepository.getAll();
        const res: GenericResponse<Permission[]> = {
            message: "Permissions fetched successfully",
            success: true,
            data: data,
        }
        return res;
    }


    /**
     *Update permission
     *
     * @param {UpdatePermissionDto} permission
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof PermissionService
     */
    public async update(permission: UpdatePermissionDto): Promise<GenericResponse<null>> {
        const response = await this.permissionRepository.update(permission);
        let res: GenericResponse<null> = {
            message: "Permission not updated",
            success: false,
            data: null,
        };

        if (response.modifiedCount > 0) {
            res = {
                message: "Permission updated successfully",
                success: true,
                data: null,
            }
        }
        return res;
    }


    /**
     *Delete a permission
     *
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof PermissionService
     */
    public async delete(_id: string): Promise<any> {
        const response = await this.permissionRepository.delete(_id);

        let res: GenericResponse<null> = {
            message: "Permission not deleted",
            success: false,
            data: null,
        }

        if (response.deletedCount > 0) {
            res = {
                message: "Permission deleted successfully",
                success: true,
                data: null,
            }
        }

        return res;
    }
}
