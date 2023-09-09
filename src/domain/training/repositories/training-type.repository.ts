import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TrainingType, UpdateTrainingType } from "../dto/training-type.dto";
import { TrainingTypeRepository } from "../interfaces/training-type-repository.interface";




@Injectable()
export class TrainingTypeRepositoryImpl implements TrainingTypeRepository {


    constructor(@InjectModel('Training_Type') private readonly TrainingTypeModel: Model<TrainingType>) { }

    create(data: TrainingType): Promise<TrainingType> {
        return this.TrainingTypeModel.create(data);
    }


    update(data: UpdateTrainingType): Promise<TrainingType> {
        return this.TrainingTypeModel.findByIdAndUpdate(data._id, data);
    }
 

    getAll(page: number, offset: number): Promise<TrainingType[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.TrainingTypeModel.find().limit(offset).skip(skip);
    }

    delete(_id: string): Promise<any> {
        return this.TrainingTypeModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<TrainingType> {
        return this.TrainingTypeModel.findById({ _id })
    }
}