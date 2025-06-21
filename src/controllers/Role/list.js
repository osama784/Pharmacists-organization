import Role from "../../models/Role.js";

const listRoles = async (req, res, next) => {
    try {
        const roles = await Role.find();
        res.json({ success: true, data: roles });
    } catch (e) {
        next(e);
    }
};

export default listRoles;
