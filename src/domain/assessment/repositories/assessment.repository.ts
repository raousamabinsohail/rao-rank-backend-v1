import { Model, UpdateWriteOpResult } from "mongoose";
import { Assessment, UpdateAssessment } from "../dto/assessment.dto";
import { AssessmentRepository } from "../interfaces/assessment-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AssessmentRepositoryImpl implements AssessmentRepository {

    constructor(@InjectModel('assessment') private readonly assessmentModel: Model<Assessment>) { }

    public create(assessment: Assessment): Promise<Assessment> {
        return this.assessmentModel.create(assessment);
    }
    public getAll(): Promise<Assessment[]> {
        return this.assessmentModel.find();
    }
    public update(assessment: UpdateAssessment): Promise<UpdateWriteOpResult> {
        let _id = assessment._id;
        delete assessment._id;
        return this.assessmentModel.updateOne({ _id }, { $set: assessment })
    }
    public delete(_id: string): Promise<any> {
        return this.assessmentModel.deleteOne({ _id });
    }

}