import Pharmacist from "../../models/Pharmacist.js";

const createPharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.create(req.validatedData);
        res.json({ success: true, data: pharmacist });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
