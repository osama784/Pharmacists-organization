import Role from "../../src/models/Role.js";
import permissions from "../../src/utils/permissions.js";

const createSuperAdminRole = async () => {
    let role = await Role.findOne({ name: "SUPER_ADMIN" });
    if (!role) {
        role = await Role.create({
            name: "SUPER_ADMIN",
        });
    }
    role.permissions = [...new Set(Object.values(permissions))];
    const doc = await role.save();
    console.log(doc);

    return doc;
};

export default createSuperAdminRole;
