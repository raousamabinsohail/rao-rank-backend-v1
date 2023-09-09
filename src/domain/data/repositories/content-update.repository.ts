import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ContentUpdateRepository } from "../interfaces/content-update-repository.interface";
import { ContentUpdate, UpdateContentUpdate } from "../dto/content-update.dto";
import { Data, UpdateData } from "../dto/data.dto";



@Injectable()
export class ContentUpdateRepositoryImpl implements ContentUpdateRepository {

    constructor(
        @InjectModel('content-updates') private readonly ContentUpdateModel: Model<ContentUpdate>,
        @InjectModel('Data') private readonly DataModel: Model<Data>,
    ) { }

    create(data: ContentUpdate): Promise<ContentUpdate> {
        try {
            return this.ContentUpdateModel.create(data);
        } catch (error) {
            throw new Error(error)
        }
    }


    async update(data: UpdateContentUpdate): Promise<ContentUpdate | any> {
        try {
            const updateLog = await this.ContentUpdateModel.updateOne(
                { _id: data._id },
                { $set: data },
            );
            if (updateLog.modifiedCount <= 0) throw new Error("Log update fail !");
            return data

        } catch (error) {
            throw new Error(error)
        }
    }


    getAll(page: number, offset: number): Promise<ContentUpdate[]> {
        //pagination 
        const skip: number = page * offset - offset;
        return this.ContentUpdateModel.find().limit(offset).skip(skip);
    }

    delete(_id: string): Promise<any> {
        return this.ContentUpdateModel.deleteOne({ _id })
    }

    getOne(_id: string): Promise<ContentUpdate> {
        return this.ContentUpdateModel.findById({ _id })
    }

    executePipe(pipe: Array<any>): Promise<any> {
        return this.ContentUpdateModel.aggregate(pipe)
    }

    executeDataPipe(pipe: Array<any>): Promise<any> {
        return this.DataModel.aggregate(pipe)
    }


    countRecord(query: any): Promise<number> {
        return this.ContentUpdateModel.countDocuments(query)
    }

    //to update data in data model
    async updateData(data: any): Promise<any> {
        try {

            let updateField = await this.DataModel.updateOne(
                { _id: data.service_id, "fields.type": data.after['field.type'] },
                { $set: { "fields.$.data": data.after.data } },
            );
            console.log("Updated Fiedl", updateField, "after=>", data.after, "==>service iD", data.service_id)
            if (updateField.modifiedCount <= 0) throw new Error("Data Update Fails !");

            return
        } catch (error) {
            throw new Error(error)
        }
    }

    createData(data: Data): Promise<any> {
        try {
            return this.DataModel.create(data);
        } catch (error) {
            throw new Error("Data not saved")
        }
    }

    //to delete data in data model
    async deleteData(data: any): Promise<any> {
        try {

            let updateField = await this.DataModel.updateOne(
                { _id: data.service_id },
                { $set: { active: false } }
            );
            if (updateField.modifiedCount <= 0) throw new Error("Data Update Fails !");

            return
        } catch (error) {
            throw new Error(error)
        }
    }

}