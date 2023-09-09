import { Model, UpdateWriteOpResult } from "mongoose";
import { Comment, UpdateCommentDto } from "../dto/comment.dto";
import { CommentRepository } from "../interfaces/comment-repository.interface";
import { InjectModel } from "@nestjs/mongoose";



export class CommentRepositoryImpl implements CommentRepository {

    constructor(@InjectModel('comments') private readonly commentModel: Model<Comment>) { }


    /**
     *Create a new comment
     *
     * @param {Comment} comment
     * @return {*}  {Promise<Comment>}
     * @memberof CommentRepositoryImpl
     */
    create(comment: Comment): Promise<Comment> {
        return this.commentModel.create(comment);
    }

    /**
     *Get all comments
     *
     * @return {*}  {Promise<Comment[]>}
     * @memberof CommentRepositoryImpl
     */
    getAll(): Promise<Comment[]> {

        const pipe = [
            {
                '$lookup': {
                    'from': 'organization-units',
                    'localField': 'ou',
                    'foreignField': '_id',
                    'as': 'ou'
                }
            }, {
                '$unwind': '$ou'
            },
            {
                '$lookup': {
                    'from': 'data',
                    'localField': 'data_id',
                    'foreignField': '_id',
                    'as': 'data_data'
                }
            }, {
                '$unwind': '$data_data'
            }, {
                '$group': {
                    '_id': '$data_data',
                    'ou_data': { '$first': '$ou' },
                    'comments': {
                        '$push': '$$ROOT'
                    }
                }
            }, {
                '$project': {
                    'comments': '$comments'
                }
            }
        ]

        return this.commentModel.aggregate(pipe).sort({ createdAt: -1 });
    }

    /**
     *Update an existing comment
     *
     * @param {UpdateCommentDto} comment
     * @return {*}  {Promise<UpdateWriteOpResult>}
     * @memberof CommentRepositoryImpl
     */
    update(comment: any): Promise<UpdateWriteOpResult> {
        return this.commentModel.updateOne({ _id: comment._id }, { $set: comment })
    }


    /**
     *Delete an existing comment
     *
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof CommentRepositoryImpl
     */
    delete(_id: string): Promise<any> {
        return this.commentModel.deleteOne({ _id });
    }


    /**
     *Get user specific comments
     *
     * @param {string} userId
     * @return {*}  {Promise<Comment[]>}
     * @memberof CommentRepositoryImpl
     */
    getByUser(userId: string): Promise<Comment[]> {
        const pipe = [
            {
                $match: {
                    uid: userId
                }
            },
            {
                $lookup: {
                    from: 'organization-units',
                    localField: 'ou',
                    foreignField: '_id',
                    as: 'ou'
                }
            },
            {
                $unwind: '$ou'
            },
            {
                $lookup: {
                    from: 'data',
                    localField: 'data_id',
                    foreignField: '_id',
                    as: 'data_data'
                }
            },
            {
                $unwind: '$data_data'
            },
            {
                $group: {
                    _id: '$data_data',
                    ou_data: { $first: '$ou' },
                    comments: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $project: {
                    comments: '$comments'
                }
            },

        ];
        return this.commentModel.aggregate(pipe).sort({ createdAt: -1 });;
    }


    /**
     *Get data specific comments
     *
     * @param {string} dataId
     * @return {*}  {Promise<Comment[]>}
     * @memberof CommentRepositoryImpl
     */
    getByDataId(dataId: string): Promise<Comment[]> {
        return this.commentModel.find({ data_id: dataId, status: 'APPROVED' })
            .populate('approved_by')
            .populate('by')
    }
}