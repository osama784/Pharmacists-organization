import User from "../../models/User.js";

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        const username = req.validatedData.username;
        if (username) {
            const exists = await User.checkUniqueUsername(req.params.id, username);

            if (exists) {
                res.status(400).json({ messgae: "username is taken" });
                return;
            }
        }
        await user.updateOne({ $set: req.validatedData });
        const doc = await User.findById({ _id: user._id }).select("-password");
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateUser;
