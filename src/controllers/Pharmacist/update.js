import Pharmacist from "../../models/Pharmacist.js";

const updatePharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404).json({ success: false });
            return;
        }
        await pharmacist.updateOne({ $set: req.validatedData });
        const doc = await Pharmacist.findById(pharmacist._id);
        res.json({ success: true, data: doc });
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
