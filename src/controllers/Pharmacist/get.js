import Pharmacist from "../../models/Pharmacist.js";

const getPharmacist = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404).json({ success: false });
            return;
        }
        res.json({ success: true, data: pharmacist });
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
