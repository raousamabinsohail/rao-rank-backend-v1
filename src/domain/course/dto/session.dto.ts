import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";


export class Session {
    title: string;
    type: string;
    typeId : string;
    date : string
    start_time : string;
    end_time : string;
    status: string;
    active : boolean
}

export class UpdateSession extends IntersectionType(Session) {
    _id:Types.ObjectId;
}