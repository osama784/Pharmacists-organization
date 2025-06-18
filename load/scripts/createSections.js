import loadJSONFile from "./loadJsonFile.js";
import Section from "../../src/models/Section.js";
import Fee from "../../src/models/Fee.js";
const sections = await loadJSONFile("../data/sections.json");

const createSections = async () => {
    await sections.forEach(async (section) => {
        const doc = await Section.create({ name: section.name });
        console.log(doc);
    });
};

export default createSections;
