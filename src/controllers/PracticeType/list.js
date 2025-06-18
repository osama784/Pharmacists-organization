import PracticeType from "../../models/PracticeType.js";

const listPracticeTypes = async (req, res, next) => {
    try {
        const data = await PracticeType.find().select("-fees");
        res.json(data);
    } catch (e) {
        next(e);
    }
};

export default listPracticeTypes;
