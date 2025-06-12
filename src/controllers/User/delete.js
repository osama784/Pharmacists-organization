import User from "../../models/User.js";

const deleteUser = async (req, res, next) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteUser;
