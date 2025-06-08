import { AnyBulkWriteOperation } from "mongoose";
import sections from "../data/sections.json";
import Section from "../../src/models/Section";

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
