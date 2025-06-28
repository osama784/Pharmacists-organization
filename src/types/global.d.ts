import { Document } from "mongoose";

declare module "express" {
    interface Request {
        validatedData?: Object<any>;
    }
}

declare global {
    namespace Express {
        interface User extends Document {}
    }
}
