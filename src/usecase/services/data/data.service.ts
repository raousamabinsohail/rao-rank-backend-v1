import { Inject, Injectable } from '@nestjs/common';
import { GenericResponse } from 'src/domain/dto/generic';
import { Data, UpdateData } from 'src/domain/data/dto/data.dto';
import { DataRepository } from 'src/domain/data/interfaces/data-repository.interface';

@Injectable()
export class DataService {

    constructor(@Inject('DataRepository') private DataRepository: DataRepository) { }

    public async getSequence(): Promise<GenericResponse<Data[]>> {
        try {

            //aggregation to find greatest ID
            const pipe: any = [
                {
                    $group: {
                        _id: null,
                        id: { $max: "$id" }
                    }
                }
            ]

            const greatestID = await this.DataRepository.executePipe(pipe);

            const id: any = greatestID[0].id

            const response: GenericResponse<Data[]> = {
                success: true,
                message: 'Greatest Id Received',
                data: id,
            };

            return response;

        } catch (error) {
            throw new Error(error)
        }
    }


    public async create(data: Data): Promise<GenericResponse<Data>> {
        const res = await this.DataRepository.create(data)

        const response: GenericResponse<Data> = {
            success: true,
            message: 'Data added Successfully',
            data: res,
        };
        return response;
    }


    public async bulkUpload(data: any): Promise<GenericResponse<Data>> {

        console.log("Status : Bulk started", data)

        let notUploaded: Array<Data> | any = [];

        await Promise.all(data.data.map(async (data) => {
            const addData = await this.DataRepository.create(data);
            if (addData == null || !addData) {
                notUploaded.push(data);
            }
        }));

        const response: GenericResponse<Data> = {
            success: true,
            message: 'New data created from bulk.....',
            data: notUploaded,
        };

        return response;
    }

    public async signData(data: any): Promise<GenericResponse<Data>> {

        console.log("Status : Signed Data =", data)

        let notSigned: Array<Data> | any = [];

        await Promise.all(data.data.map(async (data : any) => {
            data.signed.date = new Date();
            console.log("===>Data",data);
            const addData = await this.DataRepository.update(data);
         
            if (addData == null || !addData) {
                notSigned.push(data);
            }
        }));

        const response: GenericResponse<Data> = {
            success: true,
            message: 'Data signed successfully.....',
            data: notSigned,
        };

        return response;
    }

    public async delete(_id: string): Promise<GenericResponse<any>> {
        const res = await this.DataRepository.delete(_id);

        const response: GenericResponse<any> = {
            success: true,
            message: res.deletedCount > 0 ? 'Data template deleted Successfully' : 'Data template Id not found',
            data: res,
        };
        return response;
    }

    public async getViewData(page: number, offset: number): Promise<GenericResponse<any>> {
        const res = await this.DataRepository.getViewData(page, offset);

        const response: GenericResponse<any> = {
            success: true,
            message: res ? 'Data View fetched Successfully' : 'Data template not found',
            data: res,
        };

        return response;
    }

    public async getContentUpdateView(page: number, offset: number): Promise<GenericResponse<any>> {
        const res = await this.DataRepository.getContentUpdateView(page, offset);

        const response: GenericResponse<any> = {
            success: true,
            message: res ? 'Content Update View fetched Successfully' : 'Content Update View not found',
            data: res,
        };

        return response;
    }


    public async update(data: UpdateData): Promise<GenericResponse<any>> {

        const res = await this.DataRepository.update(data);

        const response: GenericResponse<any> = {
            success: true,
            message: "Data Updated",
            data: res,
        };

        return response;
    }

    public async servieCount(): Promise<GenericResponse<any>> {

        let pipe = [
            {
                '$group': {
                    '_id': '$type',
                    'count': {
                        '$count': {}
                    }
                }
            }, {
                '$lookup': {
                    'from': 'data-types',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'type'
                }
            }, {
                '$addFields': {
                    'type': {
                        '$first': '$type'
                    }
                }
            }
        ]

        const res = await this.DataRepository.executePipe(pipe);

        const response: GenericResponse<any> = {
            success: true,
            message: "Data Updated",
            data: res,
        };

        return response;
    }

}