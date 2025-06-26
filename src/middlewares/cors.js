const cors = (req, res, next) => {
    // Allow any origin (* would work but not with credentials)
    const origin = req.headers.origin;

    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
    }

    // Allow credentials if needed (cookies, authorization headers)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Allowed methods
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    // Allowed headers
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

    next();
};

export default cors;
