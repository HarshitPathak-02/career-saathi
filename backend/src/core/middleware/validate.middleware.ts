import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

interface ValidateRequestOptions {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

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
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed.",
                        errors: error.details.map((detail) => ({
                            field: detail.path.join("."),
                            message: detail.message,
                        })),
                    });
                }

                req.body = value;
            }

            if (params) {
                const { error, value } = params.validate(req.params, {
                    abortEarly: false,
                    stripUnknown: true,
                });

                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed.",
                        errors: error.details.map((detail) => ({
                            field: detail.path.join("."),
                            message: detail.message,
                        })),
                    });
                }

                Object.assign(req.params, value);
            }

            if (query) {
                const { error, value } = query.validate(req.query, {
                    abortEarly: false,
                    stripUnknown: true,
                });

                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed.",
                        errors: error.details.map((detail) => ({
                            field: detail.path.join("."),
                            message: detail.message,
                        })),
                    });
                }

                req.query = value;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};