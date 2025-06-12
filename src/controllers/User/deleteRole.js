import Role from "../../models/Role.js";

const deleteRole = async (req, res, next) => {
    try {
        const result = await Role.deleteOne({ _id: req.params.roleID });
        if (result.deletedCount != 1) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteRole;
