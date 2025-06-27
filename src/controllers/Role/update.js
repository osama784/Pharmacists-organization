import Role from "../../models/Role.js";

const updateRole = async (req, res, next) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (doc.name == "SUPER_ADMIN" || doc.name == "EMPTY") {
            res.status(400).json({ success: false, message: "you can't update fixed roles (SUPER_ADMIN, EMPTY)" });
            return;
        }
        if (!doc) {
            res.status(404).json({ success: false });
            return;
        }
        await doc.updateOne({ $set: req.validatedData }, { new: true });

        const newDoc = await Role.findById(doc._id);
        res.json({ success: true, data: newDoc });
    } catch (e) {
        next(e);
    }
};

export default updateRole;
