import Pharmacist from "../../../models/Pharmacist.js";

const updatePracticeRecord = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        const practiceRecord = pharmacist.practiceRecords.id(req.params.recordID);
        if (!practiceRecord) {
            res.status(404);
            return;
        }

        Object.keys(req.validatedData).forEach((key) => {
            practiceRecord[key] = req.validatedData[key];
        });
        const doc = await pharmacist.save();
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updatePracticeRecord;
