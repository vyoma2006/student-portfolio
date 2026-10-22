const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Stores the bcrypt HASH, never the plain-text password.
    // select: false keeps it out of query results unless explicitly requested.
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);