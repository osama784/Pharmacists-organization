import Pharmacist from "../../models/Pharmacist";

const createPharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.create(req.validatedData);
        res.status(200).json({ pharmacist });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
