import { NextFunction, Request, TypedResponse } from "express";
import { Schema } from "zod";
import { responseMessages } from "../translation/response.ar";

const validate = (schema: Schema) => async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: [responseMessages.INAVLID_JSON_RESPONSE] });
        return;
    }
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((error) => {
            // const formattedPath = error.path.reduce((acc, part) => {
            //     if (typeof part === "number") {
            //         return `${acc}[${part}]`;
            //     }
            //     return acc ? `${acc}.${part}` : part;
            // }, "");
            return `${error.message}`;
        });
        res.status(400).json({ success: false, details: errors });
        return;
    }
    req.validatedData = result.data;
    next();
};

export default validate;
