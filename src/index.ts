// import { logger, loggerMiddlware } from "./middlewares/logger.js";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response, TypedResponse } from "express";
import { config } from "dotenv";
import "./config/dbConn.js";
import passport from "passport";
import authRouter from "./routes/auth.router.js";
import PharmacistsRouter from "./routes/pharmacist.router.js";
import InvoiceRouter from "./routes/invoice.router.js";
import FeeRouter from "./routes/fee.router.js";
import UserRouter from "./routes/user.router.js";
import RoleRouter from "./routes/role.router.js";
import qs from "qs";
import cors from "cors";
import AppError from "./utils/AppError.js";
import { responseMessages } from "./translation/response.ar.js";
import { UPLOADS_DIR } from "./utils/images.js";
import { MulterError } from "multer";
config();

const PORT = process.env.PORT || 3000;
const app = express();

app.set("query parser", (str: string) =>
    qs.parse(str, {
        comma: true,
        parseArrays: true,
    })
);

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/pharmacists", PharmacistsRouter);
app.use("/invoices", InvoiceRouter);
app.use("/fees", FeeRouter);
app.use("/users", UserRouter);
app.use("/users/roles", RoleRouter);

app.use((err: Error | AppError, req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            details: [err.message],
        });
    } else if (err instanceof MulterError) {
        console.log(err.message);
        console.log(err.name);
        console.log(err);
        res.status(400).json({ success: false, details: [responseMessages.UNEXPECTED_FIELD_NAME] });
    } else {
        // logger.error(err.message);
        if (err instanceof Error) {
            console.log(err.stack);
        }
        res.status(500).json({
            success: false,
            details: [responseMessages.SERVER_ERROR],
        });
    }
});

mongoose.connection.on("open", () => {
    console.log("connected to mongodb Successfully");
    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}...`);
    });
});
