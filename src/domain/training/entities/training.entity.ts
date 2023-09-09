import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * @schema Training
 */
export const TrainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    trainees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    start_date: {
      type: String,
    },
    session: [{
      type: Schema.Types.ObjectId,
      ref: "Session",
    }],
    requestId: {
      type: Schema.Types.ObjectId,
    },
    end_date: {
      type: String,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Training_Type',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { strict: false, timestamps: true },
);
