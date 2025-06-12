import Role from "../../models/Role.js";

const createRole = async (req, res, next) => {
    try {
        const roleName = req.validatedData.name;
        const exists = await Role.checkUniqueName(roleName);
        if (exists) {
            res.status(400).json({ message: "role name is taken" });
            return;
        }
        const role = await Role.create(req.validatedData);
        res.status(200).json(role);
    } catch (e) {
        next(e);
    }
};

export default createRole;
