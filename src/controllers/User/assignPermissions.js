import Role from "../../models/Role";

const assignPermissions = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.roleID);
        if (!role) {
            res.status(404);
            return;
        }
        const doc = await role.updateOne({ $set: req.validatedDate }, { new: true });
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default assignPermissions;
