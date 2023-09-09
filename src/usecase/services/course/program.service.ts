import { Inject, Injectable } from '@nestjs/common';
import { Program, UpdateProgram } from 'src/domain/course/dto/program.dto';
import { ProgramRepository } from 'src/domain/course/interfaces/Program-repository.interface';

import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class ProgramService {
    constructor(@Inject('ProgramRepository') private ProgramRepository: ProgramRepository) { }

    public async create(Program: Program): Promise<GenericResponse<Program>> {
        let res = await this.ProgramRepository.create(Program);
        return {
            message: "Program Created successfully",
            success: true,
            data: res,
        }
    }
    public async getAll(): Promise<GenericResponse<Program[]>> {
        let res = await this.ProgramRepository.getAll();
        return {
            message: "Programs fetched successfully",
            success: true,
            data: res,
        }
    }
    public async update(Program: UpdateProgram): Promise<GenericResponse<null>> {
        let res = await this.ProgramRepository.update(Program);
        if (res.modifiedCount > 0) {
            return {
                message: "Program updated successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to updated Program",
            success: true,
            data: null,
        }
    }
    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.ProgramRepository.delete(_id);
        if (res.deletedCount > 0) {
            return {
                message: "Program deleted successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to delete Program",
            success: true,
            data: null,
        }
    }
}
