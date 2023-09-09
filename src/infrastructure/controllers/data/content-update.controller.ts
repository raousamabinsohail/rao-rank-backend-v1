import { Controller, Get, Put, Post, Delete, Query, Body, UsePipes, Param, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContentUpdate, UpdateContentUpdate } from 'src/domain/data/dto/content-update.dto';
import { GenericResponse } from 'src/domain/dto/generic';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { ContentUpdateService } from 'src/usecase/services/data/content-update.service';
import { contentUpdateValidator, updateContentUpdateValidator } from './data.validations';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';


@Controller('content-update')
@ApiTags('Content Update')
@ApiBearerAuth()
export class ContentUpdateController {

    constructor(private contentUpdateService : ContentUpdateService) { }

    @Post('')
    @UsePipes(new JoiValidationPipe(contentUpdateValidator)) //validating the object
    public async create(@Body() data: ContentUpdate, @Request() req:any): Promise<GenericResponse<ContentUpdate>> {
        //Add user id to the record 
        data.updated_by = req.user.uid
        return this.contentUpdateService.create(data);
    }

    @Post('/get')
    public async getAll(@Query('offset') offset: number, @Query('page') page: number): Promise<GenericResponse<ContentUpdate[]>> {
        return this.contentUpdateService.getAll(page,offset);
    }

    @Get('/view-content-update')
    public async getView(@Query('offset') offset: number, @Query('page') page: number,@Query('status') status : string): Promise<GenericResponse<ContentUpdate[]>> {
        return this.contentUpdateService.getView(status,page,offset);
    }

    @Get('/:id')
    public async getOne(@Param('id') _id:string): Promise<GenericResponse<ContentUpdate>> {
        return this.contentUpdateService.getOne(_id);
    }


    @Put('')
    @UsePipes(new JoiValidationPipe(updateContentUpdateValidator)) //validating the object
    public async update(@Body() updateContentUpdate: UpdateContentUpdate): Promise<GenericResponse<ContentUpdate>> {
        return this.contentUpdateService.update(updateContentUpdate);
    }

    @Delete('/:id')
    public async delete(@Param('id') id: string): Promise<GenericResponse<any>> {
        return this.contentUpdateService.delete(id);
    }

    @Put('/approve')
    @UsePipes(new JoiValidationPipe(updateContentUpdateValidator)) //validating the object
    @Secured('CONTENT_APPROVE','a')
    public async approve(@Body() updateContentUpdate: UpdateContentUpdate, @Request() req:any ): Promise<GenericResponse<ContentUpdate>> {
        
        //Adding user id to the update content
        updateContentUpdate.approved_by = req.user.uid
        return this.contentUpdateService.approve(updateContentUpdate);
    }

    @Put('/reject')
    @UsePipes(new JoiValidationPipe(updateContentUpdateValidator)) //validating the object
    @Secured('CONTENT_APPROVE','a')
    public async reject(@Body() updateContentUpdate: UpdateContentUpdate, @Request() req:any ): Promise<GenericResponse<ContentUpdate>> {
        
        //Adding user id to the update content
        updateContentUpdate.approved_by = req.user.uid
        return this.contentUpdateService.reject(updateContentUpdate);
    }

}
