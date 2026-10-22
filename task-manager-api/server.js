require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing in .env');
    process.exit(1);
}

// Connect to MongoDB, then start listening
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });