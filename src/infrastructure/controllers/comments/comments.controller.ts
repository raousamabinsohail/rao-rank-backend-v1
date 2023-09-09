import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangeCommentStatusDto, Comment, UpdateCommentDto } from 'src/domain/comments/dto/comment.dto';
import { GenericResponse } from 'src/domain/dto/generic';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { CommentsService } from 'src/usecase/services/comments/comments.service';

@Controller('comments')
@ApiTags('Comments')
@ApiBearerAuth()
export class CommentsController {


    /**
     * Creates an instance of CommentsController.
     * @param {CommentsService} commentService
     * @memberof CommentsController
     */
    constructor(private commentService: CommentsService) { }


    /**
     *Create a new comment
     *
     * @param {Comment} comment
     * @param {*} req
     * @return {*}  {Promise<GenericResponse<Comment>>}
     * @memberof CommentsController
     */
    @Post('')
    public async create(@Body() comment: Comment, @Request() req: any): Promise<GenericResponse<Comment>> {
        comment.uid = req.user.uid;
        return this.commentService.create(comment);
    }


    /**
     *Get all comments
     *
     * @return {*}  {Promise<GenericResponse<Comment[]>>}
     * @memberof CommentsController
     */
    @Get('')
    @Secured('COMMENTS', 'r')
    public async getAll(): Promise<GenericResponse<Comment[]>> {
        return this.commentService.getAll();
    }


    /**
     *Update an existing comment
     *
     * @param {UpdateCommentDto} comment
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof CommentsController
     */
    @Put('')
    @Secured('COMMENTS', 'u')
    public async update(@Body() comment: UpdateCommentDto): Promise<GenericResponse<null>> {
        return this.commentService.update(comment);
    }


    /**
     *Delete an existing comment
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<null>>}
     * @memberof CommentsController
     */
    @Delete('/:id')
    @Secured('COMMENTS', 'd')
    public async delete(@Param('id') id: string): Promise<GenericResponse<null>> {

        return this.commentService.delete(id);
    }


    /**
     *Get user specific comments
     *
     * @param {*} req
     * @return {*}  {Promise<GenericResponse<Comment[]>>}
     * @memberof CommentsController
     */
    @Get('/user')
    @Secured('COMMENTS', 'r')
    public async getByUser(@Request() req: any): Promise<GenericResponse<Comment[]>> {
        return this.commentService.getByUser(req.user.uid);
    }


    /**
     *Get data specific comments
     *
     * @param {string} id
     * @return {*}  {Promise<GenericResponse<Comment[]>>}
     * @memberof CommentsController
     */
    @Get('/data/:dataId')
    @Secured('COMMENTS', 'r')
    public async getByData(@Param('dataId') id: string): Promise<GenericResponse<Comment[]>> {
        return this.commentService.getByDataId(id);
    }


    /**
     *Update Comment Status i.e APPROVE, REJECT, PENDING
     *
     * @param {ChangeCommentStatusDto} comment
     * @param {*} req
     * @return {*} 
     * @memberof CommentsController
     */
    @Put('/change-status')
    @Secured('COMMENTS', 'u')
    public async approveReject(@Body() comment: ChangeCommentStatusDto, @Request() req: any): Promise<GenericResponse<null>> {
        return this.commentService.updateStatus(comment, req.user.uid);
    }
}
