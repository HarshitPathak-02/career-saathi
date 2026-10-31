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
    fullName: Joi.string().trim().min(2).max(100).optional(),
    phoneNumber: Joi.string().allow("", null).optional(),
    headline: Joi.string().allow("", null).max(150).optional(),
    bio: Joi.string().allow("", null).max(500).optional(),
    githubUrl: Joi.string().allow("", null).optional(),
    linkedinUrl: Joi.string().allow("", null).optional(),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required",
    }),
    newPassword: Joi.string().min(8).max(100).required().messages({
        "string.min": "New password must be at least 8 characters",
        "any.required": "New password is required",
    }),
});
