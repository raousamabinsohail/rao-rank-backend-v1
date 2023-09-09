import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { GenericResponse } from 'src/domain/dto/generic';
import { UserAuthService } from '../user-auth/user-auth.service';

@Injectable()
export class FileService {

    constructor(private userService: UserAuthService) { }

    public async uploadFile(file: Express.Multer.File, type: string, uid: string) {
        try {
            const size = file.size;
            let nameArr = file.originalname.split('.');
            const extension = nameArr[nameArr.length - 1];
            let maxSize: number, dir: string, allowedExtensions: RegExp;
            console.log("u===>upload 4")
            switch (type) {
                case "ORGANIZATIONAL_UNIT":
                    allowedExtensions = /png|jpeg|jpg|gif/;

                    maxSize = 5000000;
                    dir = "ous";
                    break;
                case "PROFILE":
                    allowedExtensions = /png|jpeg|jpg|gif/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000;
                    dir = "profile";
                    break;

                case "ASSESSMENT":
                    allowedExtensions = /png|jpeg|jpg|gif/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000;
                    dir = "assessment";
                    break;

                case "SURVEY":
                    allowedExtensions = /png|jpeg|jpg|gif/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000;
                    dir = "survey";
                    break;

                case "QUESTION":
                    allowedExtensions = /png|jpeg|jpg|gif/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000;
                    dir = "question";
                    break;

                case "TRAINING_MATERIAL":
                    allowedExtensions =
                        /png|jpeg|jpg|gif|pdf|mp3/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000000;
                    dir = "training_material";
                    break;

                case "TRAINING_VEDIOS":
                    allowedExtensions = /mp4|mov|wmv|avi|mkv|mp4|webm/;
                    this.checkExtension(allowedExtensions, extension, "Unsupported Extension !")
                    maxSize = 5000000000;
                    dir = "training_vedios";
                    break;

                case "KNOWLEDGE_LIBRARY":
                    let notallowedExtensions = /exe|php|dmg/;
                    if (notallowedExtensions.test(extension))
                        throw new HttpException("Unsupported Extension !", HttpStatus.BAD_REQUEST);
                    maxSize = 5000000000;
                    dir = "knowledge_library";
                    break;

                case "data":
                    let notallowedExt = /exe|php|dmg/;
                    if (notallowedExt.test(extension))
                        throw new HttpException("Unsupported Extension !", HttpStatus.BAD_REQUEST);
                    maxSize = 5000000000;
                    dir = "data";
                    break;

                default:
                    throw new HttpException(
                        "Type required or invalid type. valid:(PROFILE, ASSESSMENT, SURVEY,  QUESTION, TRAINING_MATERIAL, TRAINING_VEDIOS,data)! ",
                        HttpStatus.BAD_REQUEST
                    );
            }
            //validating the size
            if (size > maxSize)
                throw new HttpException(
                    `file must be less than ${maxSize / 1000000}MB`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );


            let url = this.saveFile(file, dir, extension);

            if (type == "PROFILE") {
                await this.userService.updateProfile("/public" + url, uid);
            }
            return new GenericResponse<string>(true, "file uploaded succssfully",
                "/public" + url)
        } catch (e) {
            console.log(e);
        }
    }

    private checkExtension(allowedExtensions: any, extension: any, message: string) {
        if (!allowedExtensions.test(extension))
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    private saveFile(file: Express.Multer.File, dir: string, extension: string): string {
        try {
            let md5 = this.calculateFileMd5(file);
            const URL = `/${dir}/` + md5 + '.' + extension;
            const basedir = path.resolve(__dirname, '../../../../')
            const exectDir = path.join(basedir, 'public', URL);

            fs.writeFileSync(exectDir, file.buffer)
            return URL;
        } catch (e) {
            console.log(e);
        }

    }

    private calculateFileMd5(file: Express.Multer.File): string {
        return crypto.createHash('md5').update(file.buffer).digest('hex');
    }
}
