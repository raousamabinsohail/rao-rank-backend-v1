import { Data } from "../dto/data.dto";

export interface DataRepository {

    //Create data  
    create(Data: Data): Promise<Data>;

    //Update data  
    update(Data: Data): Promise<Data>;

    //Delete data  
    delete(_id: string): Promise<any>;

    //Get All data  
    getAll(page: number, offset: number): Promise<Data[]>;

    //Get data by ID
    getOne(_id:string): Promise<Data>

     //Execute Pipe
     executePipe(pipe:Array<any>): Promise<any>

     //Get record counts
     countRecord(query: any): Promise<number>

     //Get Data View
     getViewData(page: number, offset: number): Promise<any>

     //Get Content Update View
     getContentUpdateView(page: number, offset: number): Promise<any>


}