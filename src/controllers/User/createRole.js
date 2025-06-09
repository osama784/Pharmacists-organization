import Role from "../../models/Role";

const createRole = async (req, res, next) => {
    try {
        const role = await Role.create(req.validatedData);
        res.status(200).json(role);
    } catch (e) {
        next(e);
    }
};

export default createRole;
