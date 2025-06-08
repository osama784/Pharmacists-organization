import { AnyBulkWriteOperation } from "mongoose";
import practiceTypes from "../data/practiceTypes.json";
import PracticeType from "../../src/models/PracticeType";

const createPracticeTypes = async () => {
    let objects = [];
    practiceTypes.forEach((practiceType) => {
        objects.push({
            insertOne: {
                document: practiceType,
            },
        });
    });
    try {
        const result = await PracticeType.bulkWrite(objects);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export default createPracticeTypes;
