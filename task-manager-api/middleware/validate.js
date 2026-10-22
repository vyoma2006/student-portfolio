// Server-side validation + sanitization. Runs BEFORE the controller,
// so malformed requests never reach the database.

const PRIORITIES = ['low', 'medium', 'high'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(res, errors) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
}

// POST /register and POST /login
function validateAuth(req, res, next) {
    const errors = [];
    const body = req.body || {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email) errors.push('Email is required');
    else if (!EMAIL_RE.test(email)) errors.push('Email is not valid');

    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters');

    if (errors.length) return fail(res, errors);

    req.body = { email, password }; // only pass through what we expect
    next();
}

// POST /tasks (isCreate = true) and PUT /tasks/:id (isCreate = false)
function buildTaskValidator(isCreate) {
    return (req, res, next) => {
        const body = req.body || {};
        const errors = [];
        const clean = {};

        if (isCreate || body.title !== undefined) {
            if (typeof body.title !== 'string' || !body.title.trim()) {
                errors.push('Title is required');
            } else {
                clean.title = body.title.trim();
            }
        }

        if (body.description !== undefined) {
            if (typeof body.description !== 'string') errors.push('Description must be a string');
            else clean.description = body.description.trim();
        }

        if (body.completed !== undefined) {
            if (typeof body.completed !== 'boolean') errors.push('Completed must be true or false');
            else clean.completed = body.completed;
        }

        if (body.priority !== undefined) {
            if (!PRIORITIES.includes(body.priority)) {
                errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}`);
            } else {
                clean.priority = body.priority;
            }
        }

        if (errors.length) return fail(res, errors);

        req.body = clean;
        next();
    };
}

module.exports = {
    validateAuth,
    validateCreateTask: buildTaskValidator(true),
    validateUpdateTask: buildTaskValidator(false),
};