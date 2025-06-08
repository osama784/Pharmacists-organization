import Pharmacist from "../../../models/Pharmacist.js";

const updatePenalty = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        const penalty = pharmacist.penalties.id(req.params.penaltyID);
        if (!penalty) {
            res.status(404);
            return;
        }

        Object.keys(req.validatedData).forEach((key) => {
            penalty[key] = req.validatedData[key];
        });
        const doc = await pharmacist.save();
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updatePenalty;
