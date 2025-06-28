import User from "../../src/models/User.js";

const custom = async () => {
    const result = await User.find();

    console.log(result);
};

export default custom;
