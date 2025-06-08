import Pharmacist from "../../../models/Pharmacist.js";

const createLicense = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }
        const doc = await pharmacist.updateOne(
            {
                $push: {
                    licenses: req.validatedData,
                },
            },
            { new: true }
        );
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default createLicense;
