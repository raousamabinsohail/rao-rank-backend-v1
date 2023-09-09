import { Inject, Injectable } from '@nestjs/common';
import { GenericResponse } from 'src/domain/dto/generic';
import { TrainingRequest, UpdateTrainingRequest } from 'src/domain/training/dto/training-request.dto';
import { TrainingRequestRepository } from 'src/domain/training/interfaces/training-request-repository.interface';

@Injectable()
export class TrainingRequestService {

    constructor(@Inject('TrainingRequestRepository') private TrainingRequestRepository: TrainingRequestRepository){}

    public async getAll(page,offset,filter): Promise<GenericResponse<TrainingRequest[]>> {
        const res = await this.TrainingRequestRepository.getAll(page,offset,filter);

        const response: GenericResponse<TrainingRequest[]> = {
            success: true,
            message: 'Training Request fetched Successfully',
            data: res,
        };
        return response;
    }


    public async create(data: TrainingRequest): Promise<GenericResponse<TrainingRequest>> {
        const res = await this.TrainingRequestRepository.create(data)

        const response: GenericResponse<TrainingRequest> = {
            success: true,
            message: 'Training Request added Successfully',
            data: res,
        };
        return response;
    }


    public async update(data: UpdateTrainingRequest): Promise<GenericResponse<TrainingRequest>> {
        const res = await this.TrainingRequestRepository.update(data);

        const response: GenericResponse<TrainingRequest> = {
            success: true,
            message: 'Training Request updated Successfully',
            data: res,
        };
        return response;
    }

    public async delete(_id: string): Promise<GenericResponse<any>> {
        const res = await this.TrainingRequestRepository.delete(_id);

        const response: GenericResponse<any> = {
            success: true,
            message: res.deletedCount > 0 ? 'Training Request deleted Successfully' : 'Training RequestId not found',
            data: res,
        };
        return response;
    }

    public async getOne(_id: string): Promise<GenericResponse<TrainingRequest>>{
        const res = await this.TrainingRequestRepository.getOne(_id);

        const response: GenericResponse<any> = {
            success: true,
            message: res ?  'Training Request fetched Successfully' : 'Training Requestnot found',
            data: res,
        };
        
        return response;
    }

}