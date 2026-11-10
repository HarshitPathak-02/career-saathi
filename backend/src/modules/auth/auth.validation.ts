import Joi from "joi";

export const registerSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.min": "Full name must be at least 3 characters",
            "string.empty": "Full name is required",
            "any.required": "Full name is required",
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({
            "string.min": "Password must contain at least 8 characters",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
});

export const updateProfileSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.min": "Full name must be at least 3 characters",
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .optional()
        .messages({
            "string.email": "Invalid email address",
        }),

    phoneNumber: Joi.string()
        .trim()
        .allow("", null)
        .optional(),
});