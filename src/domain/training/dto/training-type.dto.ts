import { IntersectionType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class TrainingType {
  name : string;
  arabic : string
  icon : string
  active : boolean
}

class TrainingTypeWithId {
  _id: Types.ObjectId;
}

export class UpdateTrainingType extends IntersectionType(TrainingType,TrainingTypeWithId,) {}
