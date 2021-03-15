import Joi from 'joi';


export const validateSignup = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,32}$')),

        repeat_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                "any.only": "Passwords don't match",
            }),
    })
    return schema.validate(data, { abortEarly: false })
};

export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()

    })
    return schema.validate(data, { abortEarly: false })
};