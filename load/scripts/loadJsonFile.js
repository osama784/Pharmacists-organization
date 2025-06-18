import { readFile } from "fs/promises";

async function loadJSONFile(path) {
    try {
        const filePath = new URL(path, import.meta.url);
        const data = await readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading JSON file:", err);
        throw err;
    }
}

export default loadJSONFile;
