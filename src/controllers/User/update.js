import User from "../../models/User";

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            return;
        }
        const doc = await user.updateOne({ $set: req.validatedDate }, { new: true });

        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateUser;
