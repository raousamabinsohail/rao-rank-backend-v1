import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";


export class Course {
    title: string;
    description: string;
    type: string;
    image : string;
    start_date : string;
    end_date : string;
    session : Array<Types.ObjectId>
    active : boolean
    courseMaterial : Array<Object>
    status: string
}

export class UpdateCourse extends IntersectionType(Course) {
    _id:Types.ObjectId;
}