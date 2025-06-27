import Role from "../../src/models/Role.js";
import permissions from "../../src/utils/permissions.js";

const createEmptyRole = async () => {
    let role = await Role.findOne({ name: "EMPTY" });
    if (!role) {
        role = await Role.create({
            name: "EMPTY",
        });
    }
    role.permissions = [];
    const doc = await role.save();
    console.log(doc);

    return doc;
};

export default createEmptyRole;
