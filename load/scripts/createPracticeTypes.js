import PracticeType from "../../src/models/PracticeType.js";
import loadJSONFile from "./loadJsonFile.js";
const practiceTypes = await loadJSONFile("../data/practiceTypes.json");

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
