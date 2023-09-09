import { UpdateWriteOpResult } from "mongoose";
import { Program, UpdateProgram } from "../dto/Program.dto";


export interface ProgramRepository {
    create(assessment: Program): Promise<Program>;
    getAll(): Promise<Program[]>;
    update(assessment: UpdateProgram): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
}