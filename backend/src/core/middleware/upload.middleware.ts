import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

interface UploadMiddlewareOptions {
    allowedMimeTypes: string[];
    maxFileSize: number;
}

export const createUploadMiddleware = ({
    allowedMimeTypes,
    maxFileSize,
}: UploadMiddlewareOptions) => {
    return multer({
        storage: multer.memoryStorage(),

        limits: {
            fileSize: maxFileSize,
        },

        fileFilter: (
            req: Request,
            file: Express.Multer.File,
            cb: FileFilterCallback
        ) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(
                    new Error(
                        `Invalid file type. Allowed types: ${allowedMimeTypes.join(
                            ", "
                        )}`
                    )
                );
            }

            cb(null, true);
        },
    });
};  