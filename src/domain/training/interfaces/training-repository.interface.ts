import { Training } from "../dto/training.dto";


export interface TrainingRepository {
  //Create Training
  create(Training: Training): Promise<Training>;

  //Update Training
  update(Training: Training): Promise<Training>;

  //Delete Training
  delete(_id: string): Promise<any>;

  //Get All Training
  getAll(page: number, offset: number): Promise<Training[]>;

  //Get Training by ID
  getOne(_id: string): Promise<Training>;

  //Execute Pipe
  // executePipe(pipe: Array<any>): Promise<any>;

  //Get record counts
  // countRecord(query: any): Promise<number>;
}
