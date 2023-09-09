import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * @schema TrainingRequest
 */
export const TrainingRequestSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
    },
    trainingId: {
      type: Schema.Types.ObjectId,
    },
    createdType: {
      type: String,
      enum: ['TRAINING','COURSE']
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Training_Type',
    },
    ou:{
      type: Schema.Types.ObjectId,
      ref: 'Organizational-Unit',
    },
    date:{
      type: Object,
    },
    label: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING','TRAINING_CREATED','APPROVED', 'REJECTED', 'REVISION'],
      default : 'PENDING'
    },
    reason: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { strict: false, timestamps: true },
);
