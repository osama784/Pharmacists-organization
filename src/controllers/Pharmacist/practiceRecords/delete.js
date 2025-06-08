import Pharmacist from "../../../models/Pharmacist.js";

const deletePracticeRecord = async (req, res, next) => {
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
        const doc = await pharmacist.updateOne(
            {
                $pull: {
                    practiceRecords: { _id: req.params.recordID },
                },
            },
            { new: true }
        );
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default deletePracticeRecord;
