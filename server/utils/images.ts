import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const UPLOADS_DIR = path.join(__dirname, "..", "..", "..", "uploads");

export const processImage = async (
    file: Express.Multer.File,
    options: { userId: string; supportsWebP: boolean; isLegacyBrowser: boolean }
) => {
    const { userId, supportsWebP, isLegacyBrowser } = options;

    // Create output directory
    const userDir = path.join("uploads", "users", userId);
    const fullPath = path.join(__dirname, "..", "..", "..", userDir);
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
    const imageURL = path.join(userDir, `${filename}.${outputFormat}`);
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
