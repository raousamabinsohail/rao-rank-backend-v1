import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { KLibrary, UpdateKLibrary } from 'src/domain/knowledge_library/dto/klibrary.dto';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { KnowledgeLibraryService } from 'src/usecase/services/knowledge-library/knowledge-library.service';



/**
 *Knowledge Library Controllers
 *
 * @export
 * @class KnowledgeLibraryController
 */
@Controller('knowledge-library')
@ApiTags('Knowledge Library')
@ApiBearerAuth()
export class KnowledgeLibraryController {

    constructor(
        private kLibraryService: KnowledgeLibraryService
    ) { }


    /**
     *Create new knowledge library
     *
     * @param {KLibrary} kLibrary
     * @return {*}  {Promise<GenericResponse<KLibrary>>}
     * @memberof KnowledgeLibraryController
     */
    @Post()
    @Secured('KNOWLEDGE_LIBRARY', 'c')
    public async create(@Body() kLibrary: KLibrary): Promise<GenericResponse<KLibrary>> {
        return this.kLibraryService.create(kLibrary);
    }


    /**
     *Get all knowledge libraries
     *
     * @return {*}  {Promise<GenericResponse<KLibrary[]>>}
     * @memberof KnowledgeLibraryController
     */
    @Get()
    @Secured('KNOWLEDGE_LIBRARY', 'r')
    public async getAll(): Promise<GenericResponse<KLibrary[]>> {
        return this.kLibraryService.getAll();
    }


    /**
     *Update an existing knowledge library
     *
     * @param {UpdateKLibrary} kLibrary
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof KnowledgeLibraryController
     */
    @Put()
    @Secured('KNOWLEDGE_LIBRARY', 'u')
    public async update(@Body() kLibrary: UpdateKLibrary): Promise<GenericResponse<null>> {
        return this.kLibraryService.update(kLibrary);
    }


    /**
     *Delete an existing knowledge library
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof KnowledgeLibraryController
     */
    @Delete('/:id')
    @Secured('KNOWLEDGE_LIBRARY', 'd')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        return this.kLibraryService.delete(id);
    }
}
