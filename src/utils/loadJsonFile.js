import { readFile } from "fs/promises";

async function loadJSONFile(path) {
    try {
        const data = await readFile(path, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading JSON file:", err);
        throw err;
    }
}

export default loadJSONFile;
