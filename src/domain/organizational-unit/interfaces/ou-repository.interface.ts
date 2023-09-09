import { OrganizationalUnit, UpdateOUDto } from "../dto/organizational-unit.dto";
import { SearchHistory } from "../dto/search-history.dto";


/**
 * @export
 * @interface OURepository
 */
export interface OURepository {
    getWithChildren(): Promise<any>;
    //create organizationally unit 
    create(ou: OrganizationalUnit): Promise<OrganizationalUnit>;
    //Update organizationally unit 
    update(ou: UpdateOUDto): Promise<OrganizationalUnit>;
    //Delete organizationally unit 
    delete(_id: string): Promise<any>;
    //Get All organizationally units
    getAll(): Promise<OrganizationalUnit[]>;
    //Get all without parent
    getWithoutParent(): Promise<OrganizationalUnit[]>;
    //get with graph
    getWithGraph(query : any): Promise<any>
    //Get search history
    getSearchHistory(uid: string): Promise<string[]>;
    //Search category by keyword
    searchCategory(keyword: string, categoryId?: number): Promise<OrganizationalUnit[]>
    //Create searchHistory
    createSearchHistory(searchHistory: SearchHistory): Promise<SearchHistory>
    //clean function to set data
    clean():Promise<any>;
    //get parent ID form name and parent
    getParentID(query: any): Promise<any> 
    //Get category search ous
    getByCategoryId(id:number);
}