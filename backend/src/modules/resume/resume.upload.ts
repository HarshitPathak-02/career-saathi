import { createUploadMiddleware } from "../../core/middleware/upload.middleware.js";

export const resumeUpload = createUploadMiddleware({
    allowedMimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
});