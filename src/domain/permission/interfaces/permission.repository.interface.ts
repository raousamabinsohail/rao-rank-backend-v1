import { UpdateWriteOpResult } from "mongoose";
import { Permission, UpdatePermissionDto } from "../dto/permission.dto";



export interface PermissionRepository {
    create(permission:Permission) : Promise<Permission>;
    getAll() : Promise<Permission[]>;
    update(permission:UpdatePermissionDto) : Promise<UpdateWriteOpResult>;
    delete(_id:string) : Promise<any>;
}