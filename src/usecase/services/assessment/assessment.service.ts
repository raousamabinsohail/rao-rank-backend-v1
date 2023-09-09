import { Inject, Injectable } from '@nestjs/common';
import { Assessment, UpdateAssessment } from 'src/domain/assessment/dto/assessment.dto';
import { AssessmentRepository } from 'src/domain/assessment/interfaces/assessment-repository.interface';
import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class AssessmentService {

    constructor(@Inject('AssessmentRepository') private assessmentRepository: AssessmentRepository) { }

    public async create(assessment: Assessment): Promise<GenericResponse<Assessment>> {
        let res = await this.assessmentRepository.create(assessment);
        return {
            message: "Assessment Created successfully",
            success: true,
            data: res,
        }
    }
    public async getAll(): Promise<GenericResponse<Assessment[]>> {
        let res = await this.assessmentRepository.getAll();
        return {
            message: "Assessments fetched successfully",
            success: true,
            data: res,
        }
    }
    public async update(assessment: UpdateAssessment): Promise<GenericResponse<null>> {
        let res = await this.assessmentRepository.update(assessment);
        if (res.modifiedCount > 0) {
            return {
                message: "Assessment updated successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to updated assessment",
            success: true,
            data: null,
        }
    }
    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.assessmentRepository.delete(_id);
        if (res.deletedCount > 0) {
            return {
                message: "Assessment deleted successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to delete assessment",
            success: true,
            data: null,
        }
    }
}
