const validate = (schema) => async (req, res, next) => {
    if (!req.body) {
        res.status(400).json({ message: "you should send raw json information" });
        return;
    }
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
        res.status(400).json(result.error.errors);
        return;
    }
    req.validatedData = result.data;
    next();
};

export default validate;
