import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TrainingRequest, UpdateTrainingRequest } from "../dto/training-request.dto";
import { TrainingRequestRepository } from "../interfaces/training-request-repository.interface";




@Injectable()
export class TrainingRequestRepositoryImpl implements TrainingRequestRepository {


    constructor(@InjectModel('Training_Request') private readonly TrainingRequestModel: Model<TrainingRequest>) { }

    create(fieldType: TrainingRequest): Promise<TrainingRequest> {
        return this.TrainingRequestModel.create(fieldType);
    }


    update(fieldType: UpdateTrainingRequest): Promise<TrainingRequest> {
        return this.TrainingRequestModel.findByIdAndUpdate(fieldType._id, fieldType);
    }
 

    getAll(page: number, offset: number, filter: TrainingRequest): Promise<TrainingRequest[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.TrainingRequestModel.find(filter).populate('type').limit(offset).skip(skip);
    }

    delete(_id: string): Promise<any> {
        return this.TrainingRequestModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<TrainingRequest> {
        return this.TrainingRequestModel.findById({ _id })
    }
}