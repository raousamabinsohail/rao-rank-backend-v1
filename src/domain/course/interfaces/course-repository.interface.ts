import { UpdateWriteOpResult } from "mongoose";
import { Course, UpdateCourse } from "../dto/course.dto";


export interface CourseRepository {
    create(assessment: Course): Promise<Course>;
    getAll(): Promise<Course[]>;
    update(assessment: UpdateCourse): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
}