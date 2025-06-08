import loadJSONFile from "./loadJsonFile.js";
import Section from "../../src/models/Section.js";
const sections = await loadJSONFile("../data/sections.json");

const createSections = async () => {
    let objects = [];
    sections.forEach((section) => {
        objects.push({
            insertOne: {
                document: section,
            },
        });
    });
    try {
        const result = await Section.bulkWrite(objects);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export default createSections;
