import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { States, UpdateStates } from "../dto/states-records.dto";
import { StatesRepository } from "../interfaces/states-records-repository.interface";




@Injectable()
export class StatesRepositoryImpl implements StatesRepository {


    constructor(@InjectModel('Data_States') private readonly StatesModel: Model<States>) { }

    create(fieldType: States): Promise<States> {
        return this.StatesModel.create(fieldType);
    }


    update(fieldType: UpdateStates): Promise<States> {
        return this.StatesModel.findByIdAndUpdate(fieldType._id, fieldType);
    }
 

    getAll(page: number, offset: number): Promise<States[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.StatesModel.find().limit(offset).skip(skip);
    }

    delete(_id: string): Promise<any> {
        return this.StatesModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<States> {
        return this.StatesModel.findById({ _id })
    }
}