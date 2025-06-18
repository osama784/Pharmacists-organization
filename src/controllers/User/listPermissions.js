import { ReadablePermissions } from "../../utils/permissions.js";

const listPermissions = (req, res, next) => {
    res.json(ReadablePermissions);
};

export default listPermissions;
