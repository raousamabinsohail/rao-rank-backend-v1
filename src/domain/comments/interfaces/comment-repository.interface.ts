import { UpdateWriteOpResult } from "mongoose";
import { Comment, UpdateCommentDto } from "../dto/comment.dto";



/**
 *Comment Repository to interact with comments collection
 *
 * @export
 * @interface CommentRepository
 */
export interface CommentRepository {
    //Create a new comment
    create(comment: Comment): Promise<Comment>;

    //Get all comments
    getAll(): Promise<Comment[]>;

    //Update a comment
    update(comment: any): Promise<UpdateWriteOpResult>;

    //Delete a comment
    delete(_id: string): Promise<any>;

    //Get user specific comments
    getByUser(userId: string): Promise<Comment[]>;

    //Get data specific comments
    getByDataId(dataId:string):Promise<Comment[]>
}