import User from "../../models/User";

const deleteUser = async (req, res, next) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(404);
            return;
        }
        res.status(204);
    } catch (e) {
        next(e);
    }
};

export default deleteUser;
