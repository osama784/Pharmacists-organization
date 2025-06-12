import Pharmacist from "../../models/Pharmacist.js";

const updatePharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.sendStatus(404);
            return;
        }
        await pharmacist.updateOne({ $set: req.validatedData });
        const doc = await Pharmacist.findById(pharmacist._id);
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
