import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Course, UpdateCourse } from 'src/domain/course/dto/course.dto';
import { createCourseValidation, updateCourseValidation } from 'src/domain/course/validation/course.validation.dto';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { CourseService } from 'src/usecase/services/course/course.service';

@Controller('course')
@ApiTags('Course')
@ApiBearerAuth()
export class CourseController {

    constructor(private courseService: CourseService) { }

    /**
     *
     *
     * @return {*} 
     * @memberof CourseController
     */
    @Get('')
    public async getAll() {
        return this.courseService.getAll();
    }

    /**
     *
     *
     * @param {Course} course
     * @return {*} 
     * @memberof CourseController
     */
    @Post('')
    @UsePipes(new JoiValidationPipe(createCourseValidation))
    public async create(@Body() course: Course) {
        return this.courseService.create(course);
    }

    /**
     *
     *
     * @param {UpdateCourse} course
     * @return {*} 
     * @memberof CourseController
     */
    @Put('')
    @UsePipes(new JoiValidationPipe(updateCourseValidation))
    public async update(@Body() course: UpdateCourse) {
        return this.courseService.update(course);
    }

    /**
     *
     *
     * @param {string} _id
     * @return {*} 
     * @memberof CourseController
     */
    @Delete('/:id')
    public async delete(@Param('id') _id: string) {
        return this.courseService.delete(_id);
    }
}
