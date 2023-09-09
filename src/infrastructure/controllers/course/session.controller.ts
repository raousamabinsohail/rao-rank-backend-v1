import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Session, UpdateSession } from 'src/domain/course/dto/Session.dto';
import { SessionService } from 'src/usecase/services/course/session.service';

@Controller('session')
@ApiTags('Session')
@ApiBearerAuth()
export class SessionController {

    constructor(private SessionService: SessionService) { }

    @Get('')
    public async getAll() {
        return this.SessionService.getAll();
    }

    @Post('')
    public async create(@Body() Session: Session) {
        return this.SessionService.create(Session);
    }

    @Put('')
    public async update(@Body() Session: UpdateSession) {
        return this.SessionService.update(Session);
    }

    @Delete('/:id')
    public async delete(@Param('id') _id: string) {
        return this.SessionService.delete(_id);
    }
}
