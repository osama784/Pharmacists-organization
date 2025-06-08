import Pharmacist from "../../../models/Pharmacist";

const updateLicense = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        const license = pharmacist.licenses.id(req.params.licenseID);
        if (!license) {
            res.status(404);
            return;
        }

        Object.keys(req.validatedData).forEach((key) => {
            license[key] = req.validatedData[key];
        });
        const doc = await pharmacist.save();
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateLicense;
