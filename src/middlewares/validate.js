const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json(result.error.errors);
        return;
    }
    req.validatedData = result.data;
    next();
};

export default validate;
