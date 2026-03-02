export const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') {
        error.message = `Resource not found. Invalid: ${err.path}`;
        error.statusCode = 404;
    }
    if (error.name === 'JsonWebTokenError') {
        error.message = "Invalid token, please login again.";
        error.statusCode = 401;
    }
    if (error.name === 'TokenExpiredError') {
        error.message = "Session expired, please login again.";
        error.statusCode = 401;
    }

    res.status(error.statusCode || err.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
