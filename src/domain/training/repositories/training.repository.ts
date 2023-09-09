import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Training, UpdateTraining } from "../dto/training.dto";
import { TrainingRepository } from "../interfaces/training-repository.interface";

@Injectable()
export class TrainingRepositoryImpl implements TrainingRepository {


    constructor(@InjectModel('Training') private readonly TrainingModel: Model<Training>) { }

    create(data: Training): Promise<Training> {
        return this.TrainingModel.create(data);
    }


    update(data: UpdateTraining): Promise<Training> {
        return this.TrainingModel.findByIdAndUpdate(data._id, data);
    }
 

    getAll(page: number, offset: number): Promise<Training[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.TrainingModel.find().limit(offset).skip(skip);
    }

    delete(_id: string): Promise<any> {
        return this.TrainingModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<Training> {
        return this.TrainingModel.findById({ _id })
    }
}