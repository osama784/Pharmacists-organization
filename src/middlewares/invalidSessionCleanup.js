const invalidSessionCleanup = (req, res, next) => {
    if (
        req.session?.passport?.user && // Session exists
        !req.user // But deserialization failed
    ) {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid"); // Adjust to your cookie name
            res.status(401).json({ success: false, message: "Unauthorized" });
        });
    } else {
        next();
    }
};

export default invalidSessionCleanup;
