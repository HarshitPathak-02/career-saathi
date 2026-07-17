// storage.types.ts

import { FileCategory } from "./storage.enums.js";

export interface UploadFileInput {
    buffer: Buffer;
    fileName?: string;
    mimeType: string;
}

export interface UploadFileResult {
    publicId: string;
    secureUrl: string;
    resourceType: string;
    format: string;
    bytes: number;
}

export interface DeleteFileResult {
    success: boolean;
}

export interface StorageUploadOptions {
    folder: string;
    resourceType?: "image" | "raw" | "auto";
}

export interface UploadedFileMetadata {
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    category: FileCategory;
}