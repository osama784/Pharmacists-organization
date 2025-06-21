import User from "../../models/User.js";

const createUser = async (req, res, next) => {
    try {
        const email = req.validatedData.email;
        const exists = await User.checkUniqueEmail(null, email);
        if (exists) {
            res.status(400).json({ success: false, messgae: "email is taken" });
            return;
        }

        const user = await User.create(req.validatedData);
        const doc = await User.findById(user._id).populate("role");
        res.json({ success: true, data: doc });
    } catch (e) {
        next(e);
    }
};

export default createUser;
