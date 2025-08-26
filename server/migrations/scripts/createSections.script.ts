import Section from "../../models/section.model.js";
import Fee from "../../models/fee.model.js";
import sections from "../data/sections.json";

const createSections = async () => {
    sections.forEach(async (section) => {
        const doc = await Section.create({ name: section.name });
        console.log(doc);
    });
};

export default createSections;
