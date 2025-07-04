import { NextFunction, Request, TypedResponse } from "express";
import { Schema } from "zod";

const validate = (schema: Schema) => async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: ["you should send raw json information"] });
        return;
    }
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
        const errors = result.error.errors.map((error) => {
            const formattedPath = error.path.reduce((acc, part) => {
                if (typeof part === "number") {
                    return `${acc}[${part}]`;
                }
                return acc ? `${acc}.${part}` : part;
            }, "");
            // return {
            //     path: formattedPath,
            //     message: error.message,
            // };
            return `${formattedPath}: ${error.message}`;
        });
        res.status(400).json({ success: false, details: errors });
        return;
    }
    req.validatedData = result.data;
    next();
};

export default validate;
