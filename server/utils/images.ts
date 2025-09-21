import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const PARENT_DIR = path.join(__dirname, "..", "..", "..");
export const UPLOADS_DIR = path.join(PARENT_DIR, "uploads");
export const PROJECT_DIR = path.join(__dirname, "..", "..");

export const processPharmacistImage = async (
    file: Express.Multer.File,
    options: { supportsWebP: boolean; isLegacyBrowser: boolean },
    info: { pharmacistId: string; imageType: "personal" } | { pharmacistId: string; imageType: "invoice"; invoiceId: string }
) => {
    const { supportsWebP, isLegacyBrowser } = options;

    // Create output directory
    let pharmacistDir: string;
    if (info.imageType == "personal") {
        pharmacistDir = path.join("uploads", "pharmacists", info.pharmacistId, "personal");
    } else {
        pharmacistDir = path.join("uploads", "pharmacists", info.pharmacistId, "invoices", info.invoiceId);
    }
    // const pharmacistDir = path.join("uploads", "pharmacists", pharmacistId);
    const fullPath = path.join(__dirname, "..", "..", "..", pharmacistDir);
    try {
        await fs.access(fullPath);
    } catch (e) {
        await fs.mkdir(fullPath, { recursive: true });
    }

    // Determine output format
    let outputFormat = file.mimetype === "application/pdf" ? "pdf" : "webp";
    if ((isLegacyBrowser || !supportsWebP) && outputFormat == "webp") {
        outputFormat = "jpeg";
    }

    // Generate unique filename
    const filename = file.filename;
    const imageURL = path.join(pharmacistDir, `${filename}.${outputFormat}`);
    const outputPath = path.join(fullPath, `${filename}.${outputFormat}`);

    if (outputFormat == "jpeg" || outputFormat == "webp") {
        await processImage(file, { outputFormat, outputPath });
    } else {
        await processPDF(file, { outputPath });
    }

    return {
        imageURL: imageURL.replace(/\\/g, "/"),
    };
};

export const processTreasuryImage = async (
    file: Express.Multer.File,
    options: { supportsWebP: boolean; isLegacyBrowser: boolean },
    info: { documentId: string; imageType: "expenditure" | "income" }
) => {
    const { supportsWebP, isLegacyBrowser } = options;

    // Create output directory
    let feeDir: string;
    if (info.imageType == "expenditure") {
        feeDir = path.join("uploads", "expenditures", info.documentId);
    } else {
        feeDir = path.join("uploads", "incomes", info.documentId);
    }
    const fullPath = path.join(__dirname, "..", "..", "..", feeDir);
    try {
        await fs.access(fullPath);
    } catch (e) {
        await fs.mkdir(fullPath, { recursive: true });
    }

    // Determine output format
    let outputFormat = file.mimetype === "application/pdf" ? "pdf" : "webp";
    if ((isLegacyBrowser || !supportsWebP) && outputFormat == "webp") {
        outputFormat = "jpeg";
    }

    // Generate unique filename
    const filename = file.filename;
    const imageURL = path.join(feeDir, `${filename}.${outputFormat}`);
    const outputPath = path.join(fullPath, `${filename}.${outputFormat}`);

    if (outputFormat == "jpeg" || outputFormat == "webp") {
        await processImage(file, { outputFormat, outputPath });
    } else {
        await processPDF(file, { outputPath });
    }

    return {
        imageURL: imageURL.replace(/\\/g, "/"),
    };
};

const processImage = async (file: Express.Multer.File, info: { outputFormat: string; outputPath: string }) => {
    // Create sharp instance
    let processor = sharp(file.path).resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
    });

    // Apply format-specific settings
    if (info.outputFormat === "webp") {
        processor = processor.webp({
            quality: 70,
            effort: 6, // Better compression
        });
    } else if (info.outputFormat == "jpeg") {
        processor = processor.jpeg({
            quality: 75,
            progressive: true, // For better legacy browser loading
        });
    }
    // Process and save main image
    await processor.toFile(info.outputPath);

    // Get metadata
    const metadata = await sharp(info.outputPath).metadata();

    return metadata;
};

const processPDF = async (file: Express.Multer.File, info: { outputPath: string }) => {
    await fs.rename(file.path, info.outputPath);
};
