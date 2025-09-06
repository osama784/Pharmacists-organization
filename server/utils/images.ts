import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const UPLOADS_DIR = path.join(__dirname, "..", "..", "..", "uploads");

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
    let outputFormat = "webp";
    if (isLegacyBrowser || !supportsWebP) {
        outputFormat = "jpeg";
    }
    // Generate unique filename
    const filename = file.filename;
    const imageURL = path.join(pharmacistDir, `${filename}.${outputFormat}`);
    const outputPath = path.join(fullPath, `${filename}.${outputFormat}`);

    // Create sharp instance
    let processor = sharp(file.path).resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
    });

    // Apply format-specific settings
    if (outputFormat === "webp") {
        processor = processor.webp({
            quality: 70,
            effort: 6, // Better compression
        });
    } else {
        processor = processor.jpeg({
            quality: 75,
            progressive: true, // For better legacy browser loading
        });
    }

    // Process and save main image
    await processor.toFile(outputPath);

    // Get metadata
    const metadata = await sharp(outputPath).metadata();

    return {
        fullPath: outputPath,
        imageURL: imageURL.replace(/\\/g, "/"),
        format: outputFormat,
        size: metadata.size,
        width: metadata.width,
        height: metadata.height,
    };
};
