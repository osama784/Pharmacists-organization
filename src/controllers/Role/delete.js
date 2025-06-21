import Role from "../../models/Role.js";

const deleteRole = async (req, res, next) => {
    try {
        const result = await Role.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(404).json({ success: false });
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteRole;
