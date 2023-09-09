import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * @schema TrainingType
 */
export const TrainingTypeSchema = new mongoose.Schema(
  {
    name : {
      type: String,
    },
    arabic : {
        type : String
    },
    icon : {
        type : String
    },
    active : {
        type : Boolean,
        default : true
    }
  },
  { strict: false, timestamps: true },
);
