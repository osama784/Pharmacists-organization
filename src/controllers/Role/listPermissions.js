import { ReadablePermissions } from "../../utils/permissions.js";

const listPermissions = (req, res, next) => {
    res.json({ success: true, data: ReadablePermissions });
};

export default listPermissions;
