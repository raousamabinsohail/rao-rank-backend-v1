import { IntersectionType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class Training {
  title: string;
  trainer: Types.ObjectId;
  trainees: Array<Types.ObjectId>;
  session : Array<Types.ObjectId>
  image: string
  description: string
  start_date: string;
  end_date: string;
  requestId : Types.ObjectId
  type: Types.ObjectId;
  active : boolean
}

class TrainingWithId {
  _id: Types.ObjectId;
}

export class UpdateTraining extends IntersectionType(
  Training,
  TrainingWithId,
) {}
