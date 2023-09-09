import { Inject, Injectable } from '@nestjs/common';
import { Course, UpdateCourse } from 'src/domain/course/dto/course.dto';
import { ProgramRepository } from 'src/domain/course/interfaces/Program-repository.interface';
import { SessionRepository } from 'src/domain/course/interfaces/Session-repository.interface';
import { CourseRepository } from 'src/domain/course/interfaces/course-repository.interface';
import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class CourseService {
    constructor(
        @Inject('CourseRepository') private courseRepository: CourseRepository,
        @Inject('SessionRepository') private SessionRepository: SessionRepository,
        @Inject('ProgramRepository') private ProgramRepository: ProgramRepository
        ) { }

    public async create(course: Course): Promise<GenericResponse<Course>> {
        
        let sessionIds : Array<any> = []

        //creating sessions
        await Promise.all(course.session.map(async(item:any)=>{
            //If session is type
            if(item.type == 'SESSION'){
                let programData = item.typeId
               let program : any = await this.ProgramRepository.create(programData)
               item.typeId = program._id
               let session : any = await this.SessionRepository.create(item)
               sessionIds.push(session._id)
            }

            //if type is assessment
            if(item.type == 'ASSESSMENT'){
                item.typeId = item.typeId._id
                let session : any = await this.SessionRepository.create(item)
                 sessionIds.push(session._id)
            }

            //if type is survey
            if(item.type == 'SURVEY'){
                item.typeId = item.typeId._id
                let session : any = await this.SessionRepository.create(item)
                 sessionIds.push(session._id)
            }

        }))

        course.session = sessionIds
        let res = await this.courseRepository.create(course);

        return {
            message: "Course Created successfully",
            success: true,
            data: res,
        }
    }
    public async getAll(): Promise<GenericResponse<Course[]>> {
        let res = await this.courseRepository.getAll();
        return {
            message: "Courses fetched successfully",
            success: true,
            data: res,
        }
    }
    public async update(course: UpdateCourse): Promise<GenericResponse<null>> {
        let res = await this.courseRepository.update(course);
        if (res.modifiedCount > 0) {
            return {
                message: "Course updated successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to updated course",
            success: true,
            data: null,
        }
    }
    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.courseRepository.delete(_id);
        if (res.deletedCount > 0) {
            return {
                message: "Course deleted successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to delete course",
            success: true,
            data: null,
        }
    }
}
