import Role from "../../models/Role.js";

const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            res.status(404).json({ success: false });
            return;
        }
        await role.updateOne({ $set: req.validatedData }, { new: true });
        const doc = await Role.findById(role._id);
        res.json({ success: true, data: doc });
    } catch (e) {
        next(e);
    }
};

export default updateRole;
