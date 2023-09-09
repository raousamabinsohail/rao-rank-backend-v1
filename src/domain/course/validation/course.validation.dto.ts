import * as joi from "joi";

export const createCourseValidation = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    type: joi.string(),
    image : joi.string().required(),
    start_date : joi.string(),
    end_date : joi.string(),
    session : joi.array().items(joi.object()),
    active : joi.boolean(),
    courseMaterial : joi.array().items(joi.object()),
    status: joi.string()
})

export const updateCourseValidation = joi.object({
    _id: joi.string().required(),
    title: joi.string(),
    description: joi.string(),
    type: joi.string(),
    image : joi.string(),
    start_date : joi.string(),
    end_date : joi.string(),
    session : joi.array(),
    active : joi.boolean(),
    courseMaterial : joi.array().items(joi.object()),
    status: joi.string()
})