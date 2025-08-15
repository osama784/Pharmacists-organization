import multer from "multer";
import path from "path";
import AppError from "../utils/AppError";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../translation/response.ar";
import fs from "fs/promises";

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const destiationFolder = path.join(__dirname, "..", "..", "..", "tmp");
        try {
            try {
                await fs.access(destiationFolder);
            } catch (e) {
                await fs.mkdir(destiationFolder);
            }

            cb(null, destiationFolder);
        } catch (e) {
            cb(new Error((e as Error).message), destiationFolder);
        }
    },
    filename: (req, file, cb) => {
        const filename = path.parse(file.originalname).name;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);

        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new AppError(responseMessages.INVALID_FILE_SUFFIX, 400));
        }
    },
});

export const checkBrowserWebpSupport = (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    // Check Accept header for WebP support
    const accepts = req.headers.accept || "";
    res.locals.supportsWebP = accepts.includes("image/webp");

    // Check legacy browsers (IE, older Safari)
    const userAgent = req.headers["user-agent"] || "";
    res.locals.isLegacyBrowser = /(MSIE|Trident|Edge?\/[1-7]|Safari\/[1-9]|iPhone OS [1-9])/.test(userAgent);

    next();
};

export default upload;
