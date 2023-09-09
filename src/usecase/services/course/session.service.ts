import { Inject, Injectable } from '@nestjs/common';

import { Session, UpdateSession } from 'src/domain/course/dto/session.dto';
import { SessionRepository } from 'src/domain/course/interfaces/Session-repository.interface';

import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class SessionService {
    constructor(@Inject('SessionRepository') private SessionRepository: SessionRepository) { }

    public async create(Session: Session): Promise<GenericResponse<Session>> {
        let res = await this.SessionRepository.create(Session);
        return {
            message: "Session Created successfully",
            success: true,
            data: res,
        }
    }
    public async getAll(): Promise<GenericResponse<Session[]>> {
        let res = await this.SessionRepository.getAll();
        return {
            message: "Sessions fetched successfully",
            success: true,
            data: res,
        }
    }
    public async update(Session: UpdateSession): Promise<GenericResponse<null>> {
        let res = await this.SessionRepository.update(Session);
        if (res.modifiedCount > 0) {
            return {
                message: "Session updated successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to updated Session",
            success: true,
            data: null,
        }
    }
    public async delete(_id: string): Promise<GenericResponse<null>> {
        let res = await this.SessionRepository.delete(_id);
        if (res.deletedCount > 0) {
            return {
                message: "Session deleted successfully",
                success: true,
                data: null,
            }
        }
        return {
            message: "Failed to delete Session",
            success: true,
            data: null,
        }
    }
}
