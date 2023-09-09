import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";


export class States {
    user : Types.ObjectId
    service_id : Types.ObjectId
    keyword?: string
    category_id : number
}

class StatesWithId {
    _id : Types.ObjectId
}

export class UpdateStates extends IntersectionType(States, StatesWithId) {
}



