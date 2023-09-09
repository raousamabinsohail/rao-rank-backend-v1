import { ContentUpdate } from "../dto/content-update.dto";
import { Data } from "../dto/data.dto";


export interface ContentUpdateRepository {

    //Create content update log  
    create(ContentUpdate: ContentUpdate): Promise<ContentUpdate>;

    //Update content update log  
    update(ContentUpdate: ContentUpdate): Promise<ContentUpdate>;

    //Delete content update log  
    delete(_id: string): Promise<any>;

    //Get all content update log  
    getAll(page: number, offset: number): Promise<ContentUpdate[]>;

    //Get content update log by ID
    getOne(_id: string): Promise<ContentUpdate>

    //Execute Pipe
    executePipe(pipe: Array<any>): Promise<any>

    //Get record counts
    countRecord(query: any): Promise<number>

    createData(fieldType: Data): Promise<any>

    //update data in data model
    updateData(data: any): Promise<any>

    //data pipeline execution
    executeDataPipe(pipe: Array<any>): Promise<any> 

    //delete data
    deleteData(data: any): Promise<any> 
}