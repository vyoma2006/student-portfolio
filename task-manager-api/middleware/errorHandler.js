// Central error handler — converts Mongoose / generic errors into a
// clean, structured JSON response instead of leaking raw error objects.
function errorHandler(err, req, res, next) {
    console.error(err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    // Mongoose invalid ObjectId (bad :id param)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid id format: ${err.value}`,
        });
    }

    // Duplicate key (e.g. email already registered)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate value: that record already exists',
        });
    }

    // Fallback
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}

module.exports = errorHandler;