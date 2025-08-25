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
            await fs.access(destiationFolder);
        } catch (e) {
            await fs.mkdir(destiationFolder);
        }

        cb(null, destiationFolder);
    },
    filename: (req, file, cb) => {
        const filename = path.parse(file.originalname).name;
        cb(null, `${filename}-${Date.now()}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (file.size >= 10 * 1024 * 1024) {
            cb(new AppError(`${file.originalname}: ${responseMessages.BIG_SIZE_FILE}`, 400));
            return;
        }
        if (!ext || !mime) {
            cb(new AppError(`${file.originalname}: ${responseMessages.INVALID_FILE_SUFFIX}`, 400));
            return;
        }
        cb(null, true);
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
