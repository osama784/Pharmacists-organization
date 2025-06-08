import Pharmacist from "../../../models/Pharmacist.js";

const createUniversityDegree = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        const doc = await pharmacist.updateOne(
            {
                $push: {
                    universityDegrees: req.validatedData,
                },
            },
            { new: true }
        );
        res.status(204).json(doc);
    } catch (e) {
        next(e);
    }
};

export default createUniversityDegree;
