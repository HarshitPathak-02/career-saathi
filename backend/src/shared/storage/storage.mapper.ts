import { UploadFileInput } from "./index.js";

export class StorageMapper {
    static toUploadInput(
        file: Express.Multer.File,
        folder: string
    ): UploadFileInput {
        return {
            buffer: file.buffer,
            folder,
            fileName: file.originalname,
            mimeType: file.mimetype,
        };
    }
}