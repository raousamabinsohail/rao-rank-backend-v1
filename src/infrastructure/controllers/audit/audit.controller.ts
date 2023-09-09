import { Controller,Get, Query} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Audit } from 'src/domain/audit/entities/audit.enitity';
import { GenericResponse } from 'src/domain/dto/generic';
import { AuditService } from 'src/usecase/services/audit/audit.service';


/**
 * @export
 * @class AuditController
 */

@Controller('audit')
@ApiTags('Audit')
@ApiBearerAuth()
export class AuditController {


    /**
     * Creates an instance of AuditController.
     * @param {AuditService} auditService
     * @memberof AuditController
     */
    constructor(private auditService:AuditService) {}


    /**
     *
     *
     * @return {*}  {Promise<Audit[]>}
     * @memberof AuditController
     */
    @Get('')
    public async getAll(@Query('offset') offset: number, @Query('page') page: number):Promise<GenericResponse<Audit[]>> {
        return this.auditService.getAll(offset,page);
    }
}
