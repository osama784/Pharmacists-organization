import Pharmacist from "../../models/Pharmacist";

const getPharmacist = async (req, res, next) => {
    try {
        if (req.query.ministerialNumber) {
            const pharmacist = await Pharmacist.find();
        }
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404).json({ detail: "invalid id" });
            return;
        }
        res.status(200).json({ pharmacist });
        return;
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
