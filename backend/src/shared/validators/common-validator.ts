import Joi from "joi";

/**
 * MongoDB ObjectId Validation
 */
export const objectIdSchema = Joi.string()
    .trim()
    .pattern(/^[a-f\d]{24}$/i)
    .messages({
        "string.pattern.base": "Invalid ObjectId",
    });

/**
 * Non-empty String
 */
export const nonEmptyStringSchema = Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
        "string.empty": "Field is required",
        "any.required": "Field is required",
    });

/**
 * Email
 */
export const emailSchema = Joi.string()
    .trim()
    .email()
    .lowercase()
    .messages({
        "string.email": "Invalid email address",
    });

/**
 * URL
 */
export const urlSchema = Joi.string()
    .trim()
    .uri()
    .messages({
        "string.uri": "Invalid URL",
    });

/**
 * Phone Number (10–15 digits)
 */
export const phoneNumberSchema = Joi.string()
    .trim()
    .pattern(/^\d{10,15}$/)
    .messages({
        "string.pattern.base": "Invalid phone number",
    });

/**
 * Date
 */
export const dateSchema = Joi.date();

/**
 * Positive Integer
 */
export const positiveIntegerSchema = Joi.number()
    .integer()
    .positive();

/**
 * Non-negative Integer
 */
export const nonNegativeIntegerSchema = Joi.number()
    .integer()
    .min(0);

/**
 * Boolean
 */
export const booleanSchema = Joi.boolean();