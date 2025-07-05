import { Document } from "mongoose";
import { ErrorResponse, SuccessResponse } from "./response.ts";
import { PopulatedUserDocument } from "./models/user.types.ts";

declare module "express" {
    interface Request {
        validatedData?: Object<any>;
    }
    export interface TypedResponse<T> extends Response {
        json: (body: SuccessResponse<T> | ErrorResponse) => this;
    }
}

declare global {
    namespace Express {
        interface User extends PopulatedUserDocument {}
    }
}
