import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";


export class DataDraft {
    user : Types.ObjectId
    object : Object
}

class DataDraftWithId {
    _id : Types.ObjectId
}

export class UpdateDataDraft extends IntersectionType(DataDraft, DataDraftWithId) {
}



