import Role from "../../models/Role.js";

const assignPermissions = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.roleID);
        if (!role) {
            res.sendStatus(404);
            return;
        }
        await role.updateOne({ $set: { permissions: req.validatedData } }, { new: true });
        const doc = await Role.findById(role._id);
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default assignPermissions;
