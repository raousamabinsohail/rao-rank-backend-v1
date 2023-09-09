import moment from "moment";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { Types, Document } from "mongoose";

export const AuditSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
        },
        action :{
            type : String
        },
        entity:{
            type : String
        }
    },
    { strict: false , timestamps:true}
);


export class Audit {
    userId : string
    action : string
    entity : string
}