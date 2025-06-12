import Pharmacist from "../../models/Pharmacist.js";

const getPharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json({ pharmacist });
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
