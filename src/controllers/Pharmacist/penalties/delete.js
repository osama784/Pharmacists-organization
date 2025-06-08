import Pharmacist from "../../../models/Pharmacist.js";

const deletePenalty = async (req, res, next) => {
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
        const doc = await pharmacist.updateOne(
            {
                $pull: {
                    penalties: { _id: req.params.penaltyID },
                },
            },
            { new: true }
        );
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default deletePenalty;
