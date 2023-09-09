import { Body, Controller, Param, Post, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { FileService } from 'src/usecase/services/file/file.service';


/**
 *File Upload Controller
 *
 * @export
 * @class FileController
 */
@Controller('file')
@ApiBearerAuth()
@ApiTags('File')
export class FileController {


    /**
     * Creates an instance of FileController.
     * @param {FileService} fileService
     * @memberof FileController
     */
    constructor(private fileService: FileService) { }


    /**
     *Upload any file to the server
     *
     * @param {Express.Multer.File} file
     * @param {string} type
     * @param {*} req
     * @return {*}  {Promise<GenericResponse<string>>}
     * @memberof FileController
     */
    @Post('/:type')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: 'multipart/form-data',
        description: 'Upload file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('type') type: string, @Request() req: any): Promise<GenericResponse<string>> {
       console.log("u===>upload 3")
        return this.fileService.uploadFile(file, type, req.user.uid)
    }
}
 