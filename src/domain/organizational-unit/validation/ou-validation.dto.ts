import * as joi from "joi";



export const createOuValidation = joi.object({
    name: joi.string(),
    parent: joi.any(),
    category: joi.string(),
    type: joi.string(),
    location: joi.string(),
    image: joi.string(),
    image_sq: joi.string(),
    isManager: joi.boolean(),
    active: joi.boolean(),
    id: joi.number(),
})

export const updateOuValidation = joi.object({
    _id: joi.string().required(),
    name: joi.string(),
    parent: joi.any(),
    category: joi.string(),
    type: joi.string(),
    location: joi.string(),
    image: joi.string(),
    image_sq: joi.string(),
    isManager: joi.boolean(),
    active: joi.boolean(),
    id: joi.number(),
})