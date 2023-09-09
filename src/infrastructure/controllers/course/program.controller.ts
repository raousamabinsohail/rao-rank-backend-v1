import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Program, UpdateProgram } from 'src/domain/course/dto/program.dto';
import { ProgramService } from 'src/usecase/services/course/program.service';

@Controller('program')
@ApiTags('Program')
@ApiBearerAuth()
export class ProgramController {

    constructor(private ProgramService: ProgramService) { }

    @Get('')
    public async getAll() {
        return this.ProgramService.getAll();
    }

    @Post('')
    public async create(@Body() Program: Program) {
        return this.ProgramService.create(Program);
    }

    @Put('')
    public async update(@Body() Program: UpdateProgram) {
        return this.ProgramService.update(Program);
    }

    @Delete('/:id')
    public async delete(@Param('id') _id: string) {
        return this.ProgramService.delete(_id);
    }
}
