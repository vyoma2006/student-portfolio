// The Express app, WITHOUT starting a server or connecting to MongoDB.
// Keeping this separate from server.js lets tests (supertest) import the app directly.
require('dotenv').config(); // must run before the routes load (cache.js reads env vars)

const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const debugRoutes = require('./routes/debugRoutes');
const errorHandler = require('./middleware/errorHandler');
require('./listeners'); // registers the event listeners once

const app = express();

// Allow the React dev server (localhost:5173) to call this API
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes); // /register, /login, /me
app.use('/tasks', taskRoutes); // protected + cached
app.use('/debug', debugRoutes); // cache hit/miss stats (protected)

// Central error handler (must be registered last)
app.use(errorHandler);

module.exports = app;