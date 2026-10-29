import mammoth from "mammoth";
import {
    extractText as extractPdfText,
    getDocumentProxy,
} from "unpdf";

import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

const MAX_PDF_PAGES = 25;

const MAX_EXTRACTED_TEXT_CHARS = 150_000;

const MIN_EXTRACTED_TEXT_CHARS = 50;

const EXTRACTION_TIMEOUT_MS = 20_000;

const PDF_MIME_TYPE = "application/pdf";

const DOCX_MIME_TYPE =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export interface ExtractedResumeText {
    text: string;

    pageCount: number | null;
}

const normalizeMimeType = (
    mimeType: string
): string =>
    mimeType
        .split(";")[0]
        .trim()
        .toLowerCase();

const normalizeText = (
    value: string
): string =>
    value
        .replaceAll("\u0000", " ")
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t\f\v]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

const withTimeout = async <T>(
    operation: Promise<T>
): Promise<T> => {
    let timeout: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>(
        (_resolve, reject) => {
            timeout = setTimeout(() => {
                reject(
                    new AppError(
                        HTTP_STATUS.UNPROCESSABLE_ENTITY,
                        "Resume processing took too long. Please try again."
                    )
                );
            }, EXTRACTION_TIMEOUT_MS);
        }
    );

    try {
        return await Promise.race([
            operation,
            timeoutPromise,
        ]);
    } finally {
        if (timeout) {
            clearTimeout(timeout);
        }
    }
};

const assertPdfSignature = (
    buffer: Buffer
): void => {
    if (
        buffer
            .subarray(0, 5)
            .toString("latin1") !== "%PDF-"
    ) {
        throw new AppError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "The uploaded file is not a valid PDF."
        );
    }
};

const assertDocxSignature = (
    buffer: Buffer
): void => {
    const isZip =
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        buffer[2] === 0x03 &&
        buffer[3] === 0x04;

    if (!isZip) {
        throw new AppError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "The uploaded file is not a valid DOCX document."
        );
    }
};

const validateExtractedText = (
    text: string
): string => {
    const normalizedText = normalizeText(text).slice(
        0,
        MAX_EXTRACTED_TEXT_CHARS
    );

    if (
        normalizedText.length <
        MIN_EXTRACTED_TEXT_CHARS
    ) {
        throw new AppError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "We could not read enough text from this resume. Upload a text-based PDF or DOCX file."
        );
    }

    return normalizedText;
};

const extractPdf = async (
    buffer: Buffer
): Promise<ExtractedResumeText> => {
    assertPdfSignature(buffer);

    const document = await getDocumentProxy(
        new Uint8Array(buffer)
    );

    if (document.numPages > MAX_PDF_PAGES) {
        throw new AppError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            `Resume PDFs must contain at most ${MAX_PDF_PAGES} pages.`
        );
    }

    const result = await extractPdfText(
        document,
        {
            mergePages: true,
        }
    );

    const text = Array.isArray(result.text)
        ? result.text.join("\n")
        : result.text;

    return {
        text: validateExtractedText(text),

        pageCount: result.totalPages,
    };
};

const extractDocx = async (
    buffer: Buffer
): Promise<ExtractedResumeText> => {
    assertDocxSignature(buffer);

    const result = await mammoth.extractRawText({
        buffer,
    });

    return {
        text: validateExtractedText(result.value),

        pageCount: null,
    };
};

export const extractResumeText = async (
    buffer: Buffer,
    mimeType: string
): Promise<ExtractedResumeText> => {
    const normalizedMimeType = normalizeMimeType(
        mimeType
    );

    try {
        if (normalizedMimeType === PDF_MIME_TYPE) {
            return await withTimeout(
                extractPdf(buffer)
            );
        }

        if (normalizedMimeType === DOCX_MIME_TYPE) {
            return await withTimeout(
                extractDocx(buffer)
            );
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "We could not read this resume. Upload a text-based PDF or DOCX file."
        );
    }

    throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Unsupported resume format. Upload a PDF or DOCX file."
    );
};
