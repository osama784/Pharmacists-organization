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
import ReportsRouter from "./routes/reports.router.js";
import BankRouter from "./routes/bank.router.js";
import qs from "qs";
import cors from "cors";
import AppError from "./utils/AppError.js";
import { responseMessages } from "./translation/response.ar.js";
import { UPLOADS_DIR } from "./utils/images.js";
import multer, { MulterError } from "multer";
import { logger } from "./middlewares/logger.middleware.js";
import { MulterErrorTranslator } from "./translation/utils.ar.js";
import path from "path";
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
app.use(express.static(path.join(__dirname, "..", "front")));
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/pharmacists", PharmacistsRouter);
app.use("/api/invoices", InvoiceRouter);
app.use("/api/fees", FeeRouter);
app.use("/api/users", UserRouter);
app.use("/api/users/roles", RoleRouter);
app.use("/api/reports", ReportsRouter);
app.use("/api/banks", BankRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "front", "index.html"));
});

app.use((err: Error | AppError, req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            details: [err.message],
        });
    } else {
        console.error(`${err.name}: ${err.message}`);
        if (err instanceof MulterError) {
            res.status(400).json({ success: false, details: [MulterErrorTranslator(err.code)] });
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
    }
});

mongoose.connection.on("open", () => {
    console.log("connected to mongodb Successfully");
    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}...`);
    });
});
