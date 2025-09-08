import Role from "../../models/role.model.js";
import permissions from "../../utils/permissions.js";

const createSuperAdminRole = async () => {
    let role = await Role.findOne({ name: "مدير عام" });
    if (!role) {
        role = await Role.create({
            name: "مدير عام",
        });
    }
    role.permissions = [...new Set(Object.values(permissions))];
    const doc = await role.save();
    console.log(doc);

    return doc;
};

export default createSuperAdminRole;
