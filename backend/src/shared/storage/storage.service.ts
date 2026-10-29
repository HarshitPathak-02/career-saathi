import cloudinary from "./storage.config.js";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { randomUUID } from "node:crypto";
import path from "node:path";

import {
    DeleteFileResult,
    StorageUploadOptions,
    UploadFileInput,
    UploadFileResult,
} from "./storage.types.js";

class StorageService {
    public async uploadFile(
        file: UploadFileInput,
        options: StorageUploadOptions
    ): Promise<UploadFileResult> {
        const result = await this.upload(file, options);

        return {
            publicId: result.public_id,
            secureUrl: result.secure_url,
            resourceType: result.resource_type,
            format: result.format,
            bytes: result.bytes,
        };
    }

    public async deleteFile(
        publicId: string
    ): Promise<DeleteFileResult> {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
        });

        return {
            success: true,
        };
    }

    private buildPublicId(
        fileName?: string
    ): string {
        const extension = fileName
            ? path.extname(fileName).toLowerCase()
            : "";

        return `${randomUUID()}${extension}`;
    }

    private upload(
        file: UploadFileInput,
        options: StorageUploadOptions
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options.folder,
                    resource_type: options.resourceType ?? "auto",
                    public_id: this.buildPublicId(file.fileName),
                },
                (error, result) => {
                    if (error) {
                        return reject(
                            new Error("Failed to upload file.")
                        );
                    }

                    if (!result) {
                        return reject(
                            new Error("No response received from Cloudinary.")
                        );
                    }

                    resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}

export const storageService = new StorageService();