import { UpdateWriteOpResult } from "mongoose";
import { Session, UpdateSession } from "../dto/Session.dto";


export interface SessionRepository {
    create(assessment: Session): Promise<Session>;
    getAll(): Promise<Session[]>;
    update(assessment: UpdateSession): Promise<UpdateWriteOpResult>;
    delete(_id: string): Promise<any>;
}