import { Inject, Injectable } from '@nestjs/common';
import { GenericResponse } from 'src/domain/dto/generic';
import { OrganizationalUnit, UpdateOUDto } from 'src/domain/organizational-unit/dto/organizational-unit.dto';
import { SearchHistory } from 'src/domain/organizational-unit/dto/search-history.dto';
import { OURepository } from 'src/domain/organizational-unit/interfaces/ou-repository.interface';
import { User } from 'src/domain/user-auth/dto/user-type..dto';
import { ActiveUserSocketGateway } from 'src/infrastructure/gateway/active-user-socket.gateway';

/**
 * @export
 * @class OrganizationalUnitService
 */
@Injectable()
export class OrganizationalUnitService {

    constructor(
        @Inject('OURepository') private ouRepository: OURepository,
        private updateOUSocket:ActiveUserSocketGateway,
    ) { }

    /**
     *
     * Get All Organizational units
     * @return {*}  {Promise<OrganizationalUnit[]>}
     * @memberof OrganizationalUnitService
     */
    public async getAll(): Promise<GenericResponse<OrganizationalUnit[]>> {
        let data = await this.ouRepository.getAll();
        // Generic Response
        const response: GenericResponse<OrganizationalUnit[]> = {
            success: true,
            message: 'Organizational Units Fetched Successfully',
            data: data,
        };
        return response;
    }


    /**
     *Get OUs with children
     *
     * @memberof OrganizationalUnitService
     */
    public async getWithChildren(): Promise<GenericResponse<any>> {
        let data = await this.ouRepository.getWithChildren();
        const response: GenericResponse<OrganizationalUnit[]> = {
            success: true,
            message: 'Organizational Units with children Fetched Successfully',
            data: data,
        };
        return response;
    }

    public async getWithGraph(query: any): Promise<GenericResponse<any>> {
        let data = await this.ouRepository.getWithGraph(query);
        const response: GenericResponse<OrganizationalUnit[]> = {
            success: true,
            message: 'Organizational Units with graph Fetched Successfully',
            data: data,
        };
        return response;
    }

    public async getParentID(query: any): Promise<GenericResponse<any>> {
        let data = await this.ouRepository.getParentID(query);
        const response: GenericResponse<any> = {
            success: true,
            message: 'Parent ID returned Successfully',
            data: data,
        };
        return response;
    }

    /**
     *Search category by keyword
     *
     * @return {*}  {Promise<GenericResponse<OrganizationalUnit[]>>}
     * @memberof OrganizationalUnitService
     */
    public async searchCategory(keyword: string, userId: string, categoryId?: number): Promise<GenericResponse<OrganizationalUnit[]>> {

        let searchLog: SearchHistory = {
            category_id: categoryId,
            keyword: keyword,
            user_id: userId,
        }

        this.ouRepository.createSearchHistory(searchLog);

        let res = await this.ouRepository.searchCategory(keyword, categoryId);

        const response: GenericResponse<OrganizationalUnit[]> = {
            success: true,
            message: 'Searched data fetched Successfully',
            data: res,
        };
        return response;
    }



    /**
     *
     *
     * @param {string} uid
     * @return {*}  {Promise<GenericResponse<SearchHistory[]>>}
     * @memberof OrganizationalUnitService
     */
    public async getSearchHistory(uid: string): Promise<GenericResponse<string[]>> {
        let data = await this.ouRepository.getSearchHistory(uid);
        const response: GenericResponse<string[]> = {
            success: true,
            message: 'Search history fetched Successfully',
            data: data,
        };
        return response;
    }


    /**
     *
     *
     * @return {*}  {Promise<GenericResponse<OrganizationalUnit[]>>}
     * @memberof OrganizationalUnitService
     */
    public async getWithoutParent(): Promise<GenericResponse<OrganizationalUnit[]>> {
        let data = await this.ouRepository.getWithoutParent();
        const response: GenericResponse<OrganizationalUnit[]> = {
            success: true,
            message: 'Organizational Units without parent Fetched Successfully',
            data: data,
        };
        return response;
    }


    /**
     *
     *  Create Organizational Unit
     * @param {OrganizationalUnit} ou
     * @return {*}  {Promise<OrganizationalUnit>}
     * @memberof OrganizationalUnitService
     */
    public async create(ou: OrganizationalUnit): Promise<GenericResponse<OrganizationalUnit>> {
        let res = await this.ouRepository.create(ou);
        this.updateOUSocket.updateEvent("OU");
        const response: GenericResponse<OrganizationalUnit> = {
            success: true,
            message: 'Organizational unit created Successfully',
            data: res,
        };
        return response;
    }



    /**
     *Get all ous by category ID "specifically created for" category filter component
     *
     * @param {number} id
     * @return {*}  {Promise<GenericResponse<any>>}
     * @memberof OrganizationalUnitService
     */
    public async getByCategoryId(id:number):Promise<GenericResponse<any>> {
        let res = await this.ouRepository.getByCategoryId(id);

        console.log('RESDATA',res,id);
        const response: GenericResponse<any> = {
            success: true,
            message: 'Organizational units fetched Successfully',
            data: res,
        };
        return response;
    }


    /**
     *
     * Update Organizational Unit
     * @param {UpdateOUDto} ou
     * @return {*}  {Promise<OrganizationalUnit>}
     * @memberof OrganizationalUnitService
     */
    public async update(ou: UpdateOUDto): Promise<GenericResponse<OrganizationalUnit>> {
        let data = await this.ouRepository.update(ou);
        this.updateOUSocket.updateEvent("OU");
        const response: GenericResponse<OrganizationalUnit> = {
            success: true,
            message: 'Organizational unit updated Successfully',
            data: data,
        };
        return response;
    }


    /**
     *
     * Delete Organizational Unit
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof OrganizationalUnitService
     */
    public async delete(_id: string): Promise<GenericResponse<any>> {
        let res = await this.ouRepository.delete(_id);
        this.updateOUSocket.updateEvent("OU");
        const response: GenericResponse<any> = {
            success: true,
            message: 'Organizational unit deleted Successfully',
            data: res,
        };
        return response;
    }

    public async clean(): Promise<GenericResponse<any>> {
        let res = await this.ouRepository.clean();
        let response: GenericResponse<any> = {
            success: false,
            message: 'Failed to clean ou',
            data: null,
        };
        if (res) {
            response = {
                success: true,
                message: 'OU cleaned successfully',
                data: res,
            };
        }

        return response;
    }
}
