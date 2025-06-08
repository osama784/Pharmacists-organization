import Pharmacist from "../../../models/Pharmacist";

const deleteUniversityDegree = async (req, res, next) => {
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
        const doc = await pharmacist.updateOne({
            $pull: {
                universityDegrees: { _id: req.params.universityDegreeID },
            },
        });
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default deleteUniversityDegree;
