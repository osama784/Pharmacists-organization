// import { logger, loggerMiddlware } from "./middlewares/logger.js";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import "./config/dbConn.js";
import passport from "passport";
import authRouter from "./routes/Auth.js";
import PharmacistsRouter from "./routes/Pharmacist.js";
import InvoiceRouter from "./routes/Invoice.js";
import FeeRouter from "./routes/Fee.js";
import UserRouter from "./routes/User.js";
import RoleRouter from "./routes/Role.js";
import PracticeTypeRouter from "./routes/PracticeType.js";
import qs from "qs";
import cors from "./middlewares/cors.js";
import AppError from "./utils/AppError.js";
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
app.use(cors);

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/pharmacists", PharmacistsRouter);
app.use("/invoices", InvoiceRouter);
app.use("/fees", FeeRouter);
app.use("/users", UserRouter);
app.use("/users/roles", RoleRouter);
app.use("/practiceTypes", PracticeTypeRouter);

app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    } else {
        // logger.error(err.message);
        if (err instanceof Error) {
            console.log(err.stack);
        }
        res.status(500).json({
            success: false,
            message: "Something went wrong on the server",
        });
    }
});

mongoose.connection.on("open", () => {
    console.log("connected to mongodb Successfully");
    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}...`);
    });
});
