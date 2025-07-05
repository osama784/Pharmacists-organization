import { NextFunction, Request, TypedResponse } from "express";
import loadJsonFile from "../../utils/loadJsonFile.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFinesDate = async (req: Request, res: TypedResponse<string>, next: NextFunction) => {
    const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
    try {
        const staticData = await loadJsonFile(DATA_PATH);
        res.json({ success: true, data: staticData["fines-date"] });
    } catch (e) {
        next(e);
    }
};

export default getFinesDate;
