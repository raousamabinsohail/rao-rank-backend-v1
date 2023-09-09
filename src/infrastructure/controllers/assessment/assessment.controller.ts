import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Assessment, UpdateAssessment } from 'src/domain/assessment/dto/assessment.dto';
import { AssessmentService } from 'src/usecase/services/assessment/assessment.service';

@Controller('assessment')
@ApiTags('Assessment')
@ApiBearerAuth()
export class AssessmentController {

    constructor(private assessmentService: AssessmentService) { }

    @Get('')
    public async getAll() {
        return this.assessmentService.getAll();
    }

    @Post('')
    public async create(@Body() assessment: Assessment) {
        return this.assessmentService.create(assessment);
    }

    @Put('')
    public async update(@Body() assessment: UpdateAssessment) {
        return this.assessmentService.update(assessment);
    }

    @Delete('/:id')
    public async delete(@Param('id') _id: string) {
        return this.assessmentService.delete(_id);
    }
}
