import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Data, UpdateData } from "../dto/data.dto";
import { DataRepository } from "../interfaces/data-repository.interface";



@Injectable()
export class DataRepositoryImpl implements DataRepository {

    constructor(
        @InjectModel('Data') private readonly DataModel: Model<Data>,
        @InjectModel('view_data') private readonly DataViewModel: Model<any>,
        @InjectModel('view_content_updates') private readonly ContentUpdateViewModel: Model<any>
    ) { }

    create(data: Data): Promise<Data | null> {
        try {
            return this.DataModel.create(data);
        } catch (error) {
            return null
        }
    }


    update(data: UpdateData): Promise<Data> {
        return this.DataModel.findByIdAndUpdate(data._id, data);
    }


    getAll(page: number, offset: number): Promise<Data[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.DataModel.find().limit(offset).skip(skip);
    }

    getViewData(page: number, offset: number): Promise<any> {
        try {
            //pagination 
            const skip: number = page * offset - offset;
            return this.DataViewModel.find();
        } catch (error) {
            throw new Error(error)
        }
    }

    getContentUpdateView(page: number, offset: number): Promise<any> {
        try {
            //pagination 
            const skip: number = page * offset - offset;
            return this.ContentUpdateViewModel.find();
        } catch (error) {
            throw new Error(error)
        }
    }

    delete(_id: string): Promise<any> {
        return this.DataModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<Data> {
        return this.DataModel.findById({ _id })
    }

    executePipe(pipe: Array<any>): Promise<any> {
        return this.DataModel.aggregate(pipe)
    }


    countRecord(query: any): Promise<number> {
        return this.DataModel.countDocuments(query)
    }
}