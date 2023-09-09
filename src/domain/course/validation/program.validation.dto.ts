import * as joi from "joi";

export const createProgramValidation = joi.object({
    trainer: joi.object(),
    is_online: joi.string(),
    video_url : joi.string(),
    zoom_url : joi.string(),
    address : joi.boolean(),
})

export const updateProgramValidation = joi.object({
    _id: joi.string().required(),
    trainer: joi.object(),
    is_online: joi.string(),
    video_url : joi.string(),
    zoom_url : joi.string(),
    address : joi.boolean(),
})