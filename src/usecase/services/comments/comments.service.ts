import { Inject, Injectable } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { ChangeCommentStatusDto, Comment, UpdateCommentDto } from 'src/domain/comments/dto/comment.dto';
import { CommentRepository } from 'src/domain/comments/interfaces/comment-repository.interface';
import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class CommentsService {

    /**
     * Creates an instance of CommentsService.
     * @param {CommentRepository} commentRepository
     * @memberof CommentsService
     */
    constructor(@Inject('CommentRepository') private readonly commentRepository: CommentRepository) { }

    public async getAll(): Promise<GenericResponse<Comment[]>> {
        let data: Comment[] = await this.commentRepository.getAll();

        let response: GenericResponse<Comment[]> = {
            success: true,
            message: "Comments fetched successfully",
            data: data
        }
        return response;
    }

    public async create(comment: Comment): Promise<GenericResponse<Comment>> {
        let data: Comment = await this.commentRepository.create(comment);

        let response: GenericResponse<Comment> = {
            success: true,
            message: "Comment created successfully",
            data: data
        }
        return response;
    }

    public async update(comment: UpdateCommentDto): Promise<GenericResponse<null>> {
        let data: UpdateWriteOpResult = await this.commentRepository.update(comment);

        let response: GenericResponse<null> = {
            success: false,
            message: "Failed to update Comment",
            data: null
        }

        if (data.modifiedCount == 1) {
            response = {
                success: true,
                message: "Comments updated successfully",
                data: null
            }
        }
        return response;
    }

    public async delete(_id: string): Promise<GenericResponse<null>> {
        let data: any = await this.commentRepository.delete(_id);

        let response: GenericResponse<null> = {
            success: false,
            message: "Failed to delete Comment",
            data: null
        }

        if (data.deletedCount == 1) {
            response = {
                success: true,
                message: "Comment deleted successfully",
                data: null
            }
        }
        return response;
    }

    public async getByUser(uid: string): Promise<GenericResponse<Comment[]>> {
        let data: Comment[] = await this.commentRepository.getByUser(uid);

        let response: GenericResponse<Comment[]> = {
            success: true,
            message: "Comments fetched successfully",
            data: data
        }
        return response;
    }

    public async getByDataId(dataId: string): Promise<GenericResponse<Comment[]>> {
        let data: Comment[] = await this.commentRepository.getByDataId(dataId);

        let response: GenericResponse<Comment[]> = {
            success: true,
            message: "Comments fetched successfully",
            data: data
        }
        return response;
    }

    public async updateStatus(comment: ChangeCommentStatusDto, uid: string): Promise<GenericResponse<null>> {

        //creating approve data format
        let updateData = {
            _id: comment._id,
            status: comment.status,
            approved_by: uid
        }

        if (comment.status == "REJECTED") {
            updateData['rejectReason'] = comment.rejectReason;
        }

        let res = await this.commentRepository.update(updateData);

        let response: GenericResponse<null> = {
            success: false,
            message: "Failed to update Comment",
            data: null
        }

        if (res.modifiedCount == 1) {
            response = {
                success: true,
                message: "Comment updated successfully",
                data: null
            }
        }
        return response;
    }
}
