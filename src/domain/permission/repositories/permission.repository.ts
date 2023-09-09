import { Model, UpdateWriteOpResult } from "mongoose";
import { Permission, UpdatePermissionDto } from "../dto/permission.dto";
import { PermissionRepository } from "../interfaces/permission.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {

    constructor(@InjectModel('Permission') private readonly permissionModel: Model<Permission>) { }

    create(permission: Permission): Promise<Permission> {
        return this.permissionModel.create(permission);
    }
    getAll(): Promise<Permission[]> {
        return this.permissionModel.find();
    }
    update(permission: UpdatePermissionDto): Promise<UpdateWriteOpResult> {
        return this.permissionModel.updateOne({ _id: permission._id }, permission);
    }
    delete(_id: string): Promise<any> {
        return this.permissionModel.deleteOne({_id});
    }

}