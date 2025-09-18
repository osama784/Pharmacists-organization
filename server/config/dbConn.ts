import mongoose from "mongoose";
import { config } from "dotenv";
import { idTransformPlugin } from "./mongoose-plugins.js";

config();

export default (async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
})();

mongoose.plugin(idTransformPlugin);
mongoose.set("autoIndex", false);
