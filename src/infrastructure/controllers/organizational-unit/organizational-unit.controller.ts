import { Controller, Get, Post, Put, Delete, Body, Param, Request, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/domain/dto/generic';
import { OrganizationalUnit, UpdateOUDto } from 'src/domain/organizational-unit/dto/organizational-unit.dto';
import { SearchHistory } from 'src/domain/organizational-unit/dto/search-history.dto';
import { GetParent, SearchRequest } from 'src/domain/organizational-unit/dto/search.dto';
import { createOuValidation, updateOuValidation } from 'src/domain/organizational-unit/validation/ou-validation.dto';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';
import { OpenRoute } from 'src/domain/user-auth/decorators/public-route.decorator';
import { JoiValidationPipe } from 'src/infrastructure/pipes/joi-validation.pipe';
import { OrganizationalUnitService } from 'src/usecase/services/organizational-unit/organizational-unit.service';

/**
 * @export
 * @class OrganizationalUnitController
 */
@Controller('ou')
@ApiTags('Organizational Unit')
@ApiBearerAuth()
export class OrganizationalUnitController {

    /**
     * Creates an instance of OrganizationalUnitController.
     * @param {OrganizationalUnitService} ouService
     * @memberof OrganizationalUnitController
     */
    constructor(private ouService: OrganizationalUnitService) { }


    @Post('search-category')
    public async searchCategory(@Body() searchRequest: SearchRequest, @Request() req: any): Promise<GenericResponse<OrganizationalUnit[]>> {
        if (searchRequest.id) {
            return this.ouService.searchCategory(searchRequest.keyword, req.user.uid);
        }
        return this.ouService.searchCategory(searchRequest.keyword, req.user.uid, Number(searchRequest.id));
    }


    @Get('search-history')
    public async getSearchHistory(@Request() req: any): Promise<GenericResponse<string[]>> {
        return this.ouService.getSearchHistory(req.user.uid);
    }

    @Get('parent')
    public async getParent(): Promise<GenericResponse<OrganizationalUnit[]>> {
        return this.ouService.getWithoutParent();
    }


    /**
     * Get all organizational units
     * @return {*}  {Promise<OrganizationalUnit[]>}
     * @memberof OrganizationalUnitController
     */
    @Get('')
    @OpenRoute()
    public async getAll(): Promise<GenericResponse<OrganizationalUnit[]>> {
        return this.ouService.getAll();
    }

    @Get('ouChilds')
    @OpenRoute()
    public async getWithChildren() {
        return this.ouService.getWithChildren();
    }

    @Post('getwithgraph')
    @OpenRoute()
    public async getwithgraph(@Body() query: any) {
        return this.ouService.getWithGraph(query);
    }

    @Post('getParentID')
    @OpenRoute()
    public async getParentID(@Body() query: GetParent) {
        return this.ouService.getParentID(query);
    }
    /**
     *
     * Create Organizational Unit
     * @param {OrganizationalUnit} ou
     * @return {Promise<GenericResponse<OrganizationalUnit>>}
     * @memberof OrganizationalUnitController
     */
    @Post('')
    @Secured('OU', 'c')
    @UsePipes(new JoiValidationPipe(createOuValidation))
    public async createOU(@Body() ou: OrganizationalUnit): Promise<GenericResponse<OrganizationalUnit>> {
        return this.ouService.create(ou);
    }

    @Get('/category/filter/:id')
    public async getByCategoryId(@Param('id') id:number): Promise<GenericResponse<any>> {
        return this.ouService.getByCategoryId(id);
    }

    /**
     *
     * Delete Organizational Units
     * @param {string} _id
     * @return {*}  {Promise<OrganizationalUnit>}
     * @memberof OrganizationalUnitController
     */
    @Delete('/:id')
    @Secured('OU', 'd')
    public async deleteOU(@Param('id') _id: string): Promise<GenericResponse<OrganizationalUnit>> {
        return this.ouService.delete(_id);
    }


    /**
     *
     * Update Organizational Unit
     * @param {UpdateOUDto} updateOUDto
     * @return {*}  {Promise<OrganizationalUnit>}
     * @memberof OrganizationalUnitController
     */
    @Put('')
    @Secured('OU', 'u')
    @UsePipes(new JoiValidationPipe(updateOuValidation))
    public async updateOU(@Body() updateOUDto: UpdateOUDto): Promise<GenericResponse<any>> {
        return this.ouService.update(updateOUDto);
    }


    /**
     *Clean and structure organizational unit data
     *
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof OrganizationalUnitController
     */
    @Get('/clean')
    public async clean():Promise<GenericResponse<any>> {
        return this.ouService.clean();
    }

}
