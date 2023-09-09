import { Inject, Injectable } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { GenericResponse } from 'src/domain/dto/generic';
import { KLibrary, UpdateKLibrary } from 'src/domain/knowledge_library/dto/klibrary.dto';
import { KLIbraryRepository } from 'src/domain/knowledge_library/interfaces/klibrary-repository.interface';

@Injectable()
export class KnowledgeLibraryService {

    constructor(@Inject('KLibraryRepository') private kLibraryRepository: KLIbraryRepository) { }

    public async create(kLibrary: KLibrary): Promise<GenericResponse<KLibrary>> {
        let data = await this.kLibraryRepository.create(kLibrary);

        let response: GenericResponse<KLibrary> = {
            success: true,
            message: 'Knowledge library created successfully',
            data: data,
        };

        return response;

    }

    public async getAll(): Promise<GenericResponse<KLibrary[]>> {
        let data = await this.kLibraryRepository.getAll();
        let response: GenericResponse<KLibrary[]> = {
            success: true,
            message: 'Knowledge libraries fetched successfully',
            data: data,
        };

        return response;
    }

    public async update(kLibrary: UpdateKLibrary): Promise<GenericResponse<null>> {
        let res: UpdateWriteOpResult = await this.kLibraryRepository.update(kLibrary);

        let response: GenericResponse<null> = {
            success: false,
            message: 'Failed to update Knowledge library',
            data: null,
        };

        if (res.modifiedCount === 1) {
            response = {
                success: true,
                message: 'Knowledge library updated successfully',
                data: null,
            };
        }
        return response;
    }

    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.kLibraryRepository.delete(_id);

        // Generic Response
        let response: GenericResponse<null> = {
            success: false,
            message: 'Failed to delete Knowledge library',
            data: null,
        };

        if (res.deletedCount === 1) {
            response = {
                success: true,
                message: 'Knowledge library deleted successfully',
                data: null,
            };
        }
        return response;
    }
}
