import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "joi";
import { HTTP_STATUS } from "../constants/http-status.constants.js";

interface ValidateRequestOptions {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

const validationErrorResponse = (res: Response, error: ValidationError) => {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map(detail => ({
            field: detail.path.join("."),
            message: detail.message,
        })),
    });
};

export const validateRequest = ({
    body,
    params,
    query,
}: ValidateRequestOptions) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (body) {
                const { error, value } = body.validate(req.body, {
                    abortEarly: false,
                    stripUnknown: true,
                });

                if (error) {
                    return validationErrorResponse(res, error);
                }

                req.body = value;
            }

            if (params) {
                const { error, value } = params.validate(req.params, {
                    abortEarly: false,
                    stripUnknown: true,
                });

                if (error) {
                    return validationErrorResponse(res, error);
                }

                Object.assign(req.params, value);
            }

            if (query) {
                const { error, value } = query.validate(req.query, {
                    abortEarly: false,
                    stripUnknown: true,
                });

                if (error) {
                    return validationErrorResponse(res, error);
                }

                req.query = value;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};