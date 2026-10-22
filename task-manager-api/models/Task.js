const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Trim whitespace from the title before saving
taskSchema.pre('save', function (next) {
    if (this.title) {
        this.title = this.title.trim();
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);