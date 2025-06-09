// import { logger, loggerMiddlware } from "./middlewares/logger.js";
import mongoose from "mongoose";
import express from "express";
import { config } from "dotenv";
import "./config/dbConn.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/Auth.js";
import PharmacistsRouter from "./routes/Pharmacist.js";
import InvoiceRouter from "./routes/Invoice.js";
import FeeRouter from "./routes/Fee.js";
import UserRouter from "./routes/User.js";
config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60000 * 60,
        },
    })
);
// app.use(loggerMiddlware);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/pharmacists", PharmacistsRouter);
app.use("/invoices", InvoiceRouter);
app.use("/fees", FeeRouter);
app.use("/users", UserRouter);

app.use((err, req, res, next) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    } else {
        // logger.error(err.message);
        console.log(err.message);
        res.status(500).json({
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
