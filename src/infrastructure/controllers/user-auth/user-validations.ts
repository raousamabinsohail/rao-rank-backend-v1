import * as Joi from 'joi'

//User signup validator
export const userSignup = Joi.object({
    name: Joi.object(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    gender: Joi.string().required(),
    city: Joi.string(),
    national_id:Joi.string(),
    active: Joi.object(),
    location : Joi.string(),
    ou : Joi.array().items(Joi.string())
  });

// User register validator
export const registerUser = Joi.object({
    name: Joi.object(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    role: Joi.string().required(),
    gender: Joi.string().valid("ذكر", "أنثى", "أخرى").required(),
    city: Joi.string(),
    national_id:Joi.string(),
    active: Joi.object(),
    location : Joi.string(),
    ou : Joi.array().items(Joi.string()),
    image: Joi.string(),
})

// User login validator
export const validateLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    otp : Joi.string()
})