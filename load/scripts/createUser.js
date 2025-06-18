import User from "../../src/models/User.js";
import Role from "../../src/models/Role.js";
import bcrypt from "bcryptjs";
import createSuperAdminRole from "./createSuperAdminRole.js";

const createUser = async () => {
    let role = await Role.findOne({
        name: "SUPER_ADMIN",
    });
    if (!role) {
        role = await createSuperAdminRole();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("admin", salt);
    const user = await User.create({
        username: "osama",
        password: hash,
        role: role,
    });
    console.log(user);
};

export default createUser;
