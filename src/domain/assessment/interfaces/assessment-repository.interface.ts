import { UpdateWriteOpResult } from "mongoose";
import { Assessment, UpdateAssessment } from "../dto/assessment.dto";



export interface AssessmentRepository {
    create(assessment: Assessment): Promise<Assessment>;
    getAll(): Promise<Assessment[]>;
    update(assessment: UpdateAssessment): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
}