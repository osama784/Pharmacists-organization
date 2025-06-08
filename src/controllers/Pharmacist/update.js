import Pharmacist from "../../models/Pharmacist";

const updatePharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }
        const doc = await pharmacist.updateOne(req.validatedData, { new: true }).lean().exec();
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
