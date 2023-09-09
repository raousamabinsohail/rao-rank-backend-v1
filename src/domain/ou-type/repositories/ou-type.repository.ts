import { Injectable } from "@nestjs/common";
import { OUTypeRepository } from "../interfaces/ou-type-repository.interface";
import { OUType, UpdateOUType } from "../dto/ou-type.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/**
 *
 *
 * @export
 * @class OUTypeRepositoryImpl
 * @implements {OUTypeRepository}
 */
@Injectable()
export class OUTypeRepositoryImpl implements OUTypeRepository {


    /**
     * Creates an instance of OUTypeRepositoryImpl.
     * @param {Model<OUType>} ouTypeModel
     * @memberof OUTypeRepositoryImpl
     */
    constructor(@InjectModel('OU-Type') private readonly ouTypeModel: Model<OUType>) { }


    /**
     *
     *
     * @param {OUType} ouType
     * @return {*}  {Promise<OUType>}
     * @memberof OUTypeRepositoryImpl
     */
    create(ouType: OUType): Promise<OUType> {
        return this.ouTypeModel.create(ouType);
    }


    /**
     *
     *
     * @param {UpdateOUType} ouType
     * @return {*}  {Promise<OUType>}
     * @memberof OUTypeRepositoryImpl
     */
    update(ouType: UpdateOUType): Promise<OUType> {
        return this.ouTypeModel.findByIdAndUpdate(ouType._id, ouType);
    }


    /**
     *
     *
     * @return {*}  {Promise<OUType[]>}
     * @memberof OUTypeRepositoryImpl
     */
    getAll(): Promise<OUType[]> {
        return this.ouTypeModel.find();
    }


    /**
     *
     *
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof OUTypeRepositoryImpl
     */
    delete(_id: string): Promise<any> {
        return this.ouTypeModel.deleteOne({ _id })
    }

}