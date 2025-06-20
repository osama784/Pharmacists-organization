import User from "../../models/User.js";

const createUser = async (req, res, next) => {
    try {
        const username = req.validatedData.username;
        const exists = await User.checkUniqueUsername(null, username);
        if (exists) {
            res.status(400).json({ messgae: "username is taken" });
            return;
        }

        const user = await User.create(req.validatedData);
        const doc = await User.findById(user._id).populate("role").select("-password");
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default createUser;
