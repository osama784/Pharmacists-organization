import PracticeType from "../../src/models/PracticeType.js";
import Fee from "../../src/models/Fee.js";
import loadJSONFile from "./loadJsonFile.js";
const practiceTypes = await loadJSONFile("../data/practiceTypes.json");

const createPracticeTypes = async () => {
    await practiceTypes.forEach(async (practiceType) => {
        const fees = practiceType.fees.map(async (fee) => {
            const doc = await Fee.findOne({ name: fee });
            if (!doc) {
                throw new Error(`fee with name ${fee} not found`);
            }
            return doc._id;
        });

        const feeIds = await Promise.all(fees);
        const fee = await PracticeType.create({
            name: practiceType.name,
            fees: feeIds,
        });
        console.log(fee);
    });
};

export default createPracticeTypes;
