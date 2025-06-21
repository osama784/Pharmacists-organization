const validate = (schema) => async (req, res, next) => {
    if (!req.body) {
        res.status(400).json({ success: false, message: "you should send raw json information" });
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
            return {
                path: formattedPath,
                message: error.message,
            };
        });
        res.status(400).json({ success: false, message: "validation_errors", errors });
        return;
    }
    req.validatedData = result.data;
    next();
};

export default validate;
