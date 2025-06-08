import Pharmacist from "../../../models/Pharmacist.js";

const updateUniversityDegree = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }
        const universityDegree = pharmacist.universityDegrees.id(req.params.universityDegreeID);
        if (!universityDegree) {
            res.status(404);
            return;
        }
        Object.keys(req.validatedData).forEach((key) => {
            universityDegree[key] = req.validatedData[key];
        });
        const doc = await pharmacist.save();
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateUniversityDegree;
