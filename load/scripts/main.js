import mongoose from "mongoose";
import "./db.js";
import createSections from "./createSections.js";
import { createFees } from "./createFees.js";
import createPracticeTypes from "./createPracticeTypes.js";
import createUser from "./createUser.js";

const main = async () => {
    // await createSections();
    // await createFees();
    await createPracticeTypes();
    // await createUser();
};
main();
