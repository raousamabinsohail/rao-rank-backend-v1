import { Injectable } from "@nestjs/common";
import { SessionRepository } from "../interfaces/Session-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";
import { Session, UpdateSession } from "../dto/Session.dto";


@Injectable()
export class SessionRepositoryImpl implements SessionRepository {

    constructor(@InjectModel('Session') private readonly assessmentModel: Model<Session>) { }

    public create(Session: Session): Promise<Session> {
        return this.assessmentModel.create(Session);
    }
    public getAll(): Promise<Session[]> {
        return this.assessmentModel.find();
    }
    public update(Session: UpdateSession): Promise<UpdateWriteOpResult> {
        let _id = Session._id;
        delete Session._id;
        return this.assessmentModel.updateOne({ _id }, { $set: Session })
    }
    public delete(_id: string): Promise<any> {
        return this.assessmentModel.deleteOne({ _id });
    }
}