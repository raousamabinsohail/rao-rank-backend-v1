import { TrainingRequest } from '../dto/training-request.dto';

export interface TrainingRequestRepository {
  //Create TrainingRequest
  create(TrainingRequest: TrainingRequest): Promise<TrainingRequest>;

  //Update TrainingRequest
  update(TrainingRequest: TrainingRequest): Promise<TrainingRequest>;

  //Delete TrainingRequest
  delete(_id: string): Promise<any>;

  //Get All TrainingRequest
  getAll(page: number, offset: number, filter: TrainingRequest): Promise<TrainingRequest[]>;

  //Get TrainingRequest by ID
  getOne(_id: string): Promise<TrainingRequest>;

  //Execute Pipe
  // executePipe(pipe: Array<any>): Promise<any>;

  //Get record counts
  // countRecord(query: any): Promise<number>;
}
