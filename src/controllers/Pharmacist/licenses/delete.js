import Pharmacist from "../../../models/Pharmacist";

const deleteLicense = async (req, res, next) => {
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
        const doc = await pharmacist.updateOne(
            {
                $pull: {
                    licenses: { _id: req.params.licenseID },
                },
            },
            { new: true }
        );
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default deleteLicense;
