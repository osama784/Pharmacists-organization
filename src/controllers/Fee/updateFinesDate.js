import fs from "fs/promises";
import loadJSONFile from "../../utils/loadJsonFile.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateFinesDate = async (req, res, next) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const finesDate = req.body["fines-date"];

    if (!finesDate || typeof finesDate == "number" || isNaN(Date.parse(finesDate))) {
        res.status(400).json({ success: false, message: "invalid date value, right pattern: 'yyyy-mm-dd'" });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        const staticData = await loadJSONFile(DATA_PATH);
        staticData["fines-date"] = finesDate;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: staticData["fines-date"] });
    } catch (e) {
        next(e);
    }
};

export default updateFinesDate;
