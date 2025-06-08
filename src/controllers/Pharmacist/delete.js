import Pharmacist from "../../models/Pharmacist.js";

const deletePharmacist = async (req, res, next) => {
    try {
        const result = await Pharmacist.deleteOne({ _id: req.params.id });

        if (result.deletedCount != 1) {
            res.status(404);
            return;
        }
        res.status(204);
    } catch (e) {
        next(e);
    }
};

export default deletePharmacist;
