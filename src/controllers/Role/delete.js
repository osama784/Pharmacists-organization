import Role from "../../models/Role.js";

const deleteRole = async (req, res, next) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (doc.name == "SUPER_ADMIN" || doc.name == "EMPTY") {
            res.status(400).json({ success: false, message: "you can't delete fixed roles (SUPER_ADMIN, EMPTY)" });
            return;
        }
        await doc.deleteOne();
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteRole;
