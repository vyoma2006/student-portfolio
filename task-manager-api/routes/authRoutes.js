const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateAuth } = require('../middleware/validate');

// POST /register — hash the password, save the user
router.post('/register', validateAuth, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            success: true,
            data: { id: user._id, email: user.email },
        });
    } catch (err) {
        next(err);
    }
});

// POST /login — verify the password, sign a JWT that expires in 1 hour
router.post('/login', validateAuth, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // password is select:false in the schema, so ask for it explicitly
        const user = await User.findOne({ email }).select('+password');

        // Same message for "no such user" and "wrong password"
        // so attackers can't discover which emails are registered.
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        next(err);
    }
});

// GET /me — current user, taken from the decoded JWT
router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User no longer exists' });
        }
        res.status(200).json({
            success: true,
            data: { id: user._id, email: user.email, createdAt: user.createdAt },
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;