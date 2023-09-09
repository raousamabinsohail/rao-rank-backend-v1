import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from 'src/domain/course/interfaces/Session-repository.interface';
import { GenericResponse } from 'src/domain/dto/generic';
import { Training, UpdateTraining } from 'src/domain/training/dto/training.dto';
import { TrainingRepository } from 'src/domain/training/interfaces/training-repository.interface';

@Injectable()
export class TrainingService {

    constructor(
        @Inject('TrainingRepository') private TrainingRepository: TrainingRepository,
        @Inject('SessionRepository') private SessionRepository: SessionRepository,
        ){}

    public async getAll(page,offset): Promise<GenericResponse<Training[]>> {
        const res = await this.TrainingRepository.getAll(page,offset);

        const response: GenericResponse<Training[]> = {
            success: true,
            message: 'Training fetched Successfully',
            data: res,
        };
        return response;
    }


    public async create(data: any): Promise<GenericResponse<Training>> {
        
        let sessionIds : Array<any> = []
        
        //creating sessions
        await Promise.all(data.session.map(async(item:any)=>{
            item.typeId = item.typeId._id
            let session : any = await this.SessionRepository.create(item)
            sessionIds.push(session._id)
        }))
        
        data.session = sessionIds
        data.requestId = data.type._id
        data.type = data.type?.type?._id

        const res = await this.TrainingRepository.create(data)

        const response: GenericResponse<Training> = {
            success: true,
            message: 'Training added Successfully',
            data: res,
        };
        return response;
    }


    public async update(data: UpdateTraining): Promise<GenericResponse<Training>> {
        const res = await this.TrainingRepository.update(data);

        const response: GenericResponse<Training> = {
            success: true,
            message: 'Training updated Successfully',
            data: res,
        };
        return response;
    }

    public async delete(_id: string): Promise<GenericResponse<any>> {
        const res = await this.TrainingRepository.delete(_id);

        const response: GenericResponse<any> = {
            success: true,
            message: res.deletedCount > 0 ? 'Training deleted Successfully' : 'TrainingId not found',
            data: res,
        };
        return response;
    }

    public async getOne(_id: string): Promise<GenericResponse<Training>>{
        const res = await this.TrainingRepository.getOne(_id);

        const response: GenericResponse<any> = {
            success: true,
            message: res ?  'Training fetched Successfully' : 'Training not found',
            data: res,
        };
        
        return response;
    }

}