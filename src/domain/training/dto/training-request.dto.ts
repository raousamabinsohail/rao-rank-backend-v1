import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";


export class TrainingRequest {
    topic : string
    trainingId : Types.ObjectId
    type : string
    createdType : string
    ou : string
    date : Object
    description : string
    status : string
    reason : string
}

class TrainingRequestWithId {
    _id : Types.ObjectId
}

export class UpdateTrainingRequest extends IntersectionType(TrainingRequest, TrainingRequestWithId) {
}



