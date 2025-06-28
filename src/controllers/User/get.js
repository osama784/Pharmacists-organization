import User from "../../models/User.js";

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({ success: true, data: user });
    } catch (e) {
        next(e);
    }
};

export default getUser;
