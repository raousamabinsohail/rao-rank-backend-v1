import * as Joi from 'joi';

//create training request Validators
export const createTrainingRequestValidator = Joi.object({
  topic: Joi.string().required(),
  trainingId: Joi.string(),
  type: Joi.string(),
  createdType: Joi.string(),
  date : Joi.object(),
  ou : Joi.string(),
  description: Joi.string(),
  status: Joi.string(),
  reason: Joi.string(),
});

//update training request Validators
export const updateTrainingRequestValidator = Joi.object({
  _id: Joi.string().required(),
  topic: Joi.string(),
  trainingId: Joi.string(),
  createdType: Joi.string(),
  type: Joi.string(),
  date : Joi.object(),
  ou : Joi.string(),
  description: Joi.string(),
  status: Joi.string(),
  reason: Joi.string(),
});

//create training Validators
export const createTrainingValidator = Joi.object({
  title: Joi.string().required(),
  address : Joi.object(),
  trainer: Joi.string(),
  session: Joi.array(),
  description : Joi.string(),
  trainees: Joi.array().items(Joi.string()),
  type: Joi.any().required(),
  image: Joi.string(),
  start_date: Joi.string(),
  end_date: Joi.string(),
  active: Joi.string(),
});

//update training Validators
export const updateTrainingValidator = Joi.object({
  _id: Joi.string().required(),
  title: Joi.string(),
  address : Joi.object(),
  session: Joi.array(),
  description : Joi.string(),
  image: Joi.string(),
  trainer: Joi.object(),
  trainees: Joi.array().items(Joi.string()),
  type: Joi.string(),
  start_date: Joi.string(),
  end_date: Joi.string(),
  active: Joi.string(),
});

//update training type Validators
export const createTrainingTypeValidator = Joi.object({
  name: Joi.string().required(),
  arabic: Joi.string().required(),
  icon: Joi.string(),
  active: Joi.boolean(),
});

//update training type Validators
export const updateTrainingTypeValidator = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string(),
  arabic: Joi.string(),
  icon: Joi.string(),
  active: Joi.boolean(),
});
