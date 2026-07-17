// storage.constants.ts

export const STORAGE_FOLDERS = {
    RESUMES: "career-saathi/resumes",
    PROFILE_IMAGES: "career-saathi/profile-images",
    COMPANY_LOGOS: "career-saathi/company-logos",
    CERTIFICATES: "career-saathi/certificates",
} as const;

export const MAX_FILE_SIZE = {
    PDF: 5 * 1024 * 1024, // 5 MB
    IMAGE: 2 * 1024 * 1024, // 2 MB
} as const;

export const ALLOWED_MIME_TYPES = {
    PDF: ["application/pdf"],

    IMAGE: [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ],
} as const;