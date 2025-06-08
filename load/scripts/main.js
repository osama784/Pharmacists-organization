import mongoose from "mongoose";
import "./db";
import createSections from "./createSections";
import { createFees } from "./createFees";
import createPracticeTypes from "./createPracticeTypes";

const main = async () => {
    // await createSections();
    // await createFees();
    await createPracticeTypes();
};

mongoose.connection.on("open", () => {
    main();
});
