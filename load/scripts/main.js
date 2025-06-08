import mongoose from "mongoose";
import "./db.js";
import createSections from "./createSections.js";
import { createFees } from "./createFees.js";
import createPracticeTypes from "./createPracticeTypes.js";

const main = async () => {
    // await createSections();
    // await createFees();
    await createPracticeTypes();
};

mongoose.connection.on("open", () => {
    main();
});
