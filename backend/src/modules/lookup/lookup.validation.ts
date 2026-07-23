import Joi from 'joi';

export const domainIdParamSchema = Joi.object({
    domainId: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Domain Id is required',
            'any.required': 'Domain Id is required'
        })
});

export const roleIdParamSchema = Joi.object({
    roleId: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Role Id is required',
            'any.required': 'Role Id is required'
        })
});
