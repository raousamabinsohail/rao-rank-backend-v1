import { Injectable } from "@nestjs/common";
import { ProgramRepository } from "../interfaces/Program-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";
import { Program, UpdateProgram } from "../dto/Program.dto";
import { UpdateAssessment } from "src/domain/assessment/dto/assessment.dto";




@Injectable()
export class ProgramRepositoryImpl implements ProgramRepository {

    constructor(@InjectModel('Program') private readonly assessmentModel: Model<Program>) { }

    public create(Program: Program): Promise<Program> {
        return this.assessmentModel.create(Program);
    }
    public getAll(): Promise<Program[]> {
        return this.assessmentModel.find();
    }
    public update(Program: UpdateProgram): Promise<UpdateWriteOpResult> {
        let _id = Program._id;
        delete Program._id;
        return this.assessmentModel.updateOne({ _id }, { $set: Program })
    }
    public delete(_id: string): Promise<any> {
        return this.assessmentModel.deleteOne({ _id });
    }
}