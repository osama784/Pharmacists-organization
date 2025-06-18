import loadJsonFile from "../../utils/loadJsonFile.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFinesDate = async (req, res, next) => {
    const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
    const staticData = await loadJsonFile(DATA_PATH);
    res.json({ "fines-date": staticData["fines Date"] });
};

export default getFinesDate;
