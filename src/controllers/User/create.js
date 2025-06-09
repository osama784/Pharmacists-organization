import User from "../../models/User";

const createUser = async (req, res, next) => {
    try {
        const user = await (await User.create(req.validatedDate)).populate("role");

        res.status(200).json({ username: user.username, role: user.role });
    } catch (e) {
        next(e);
    }
};

export default createUser;
