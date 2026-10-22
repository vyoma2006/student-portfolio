const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const taskEvents = require('../events');
const { handleTaskCreated } = require('../listeners');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validate');

// Every task route requires a valid JWT (auth runs BEFORE the cache is checked,
// so unauthenticated users can never read cached data)
router.use(auth);

// GET /tasks — list all tasks (cached)
router.get('/', async (req, res, next) => {
    try {
        const cached = cache.get(cache.keys.allTasks);
        if (cached) {
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cached);
        }

        const tasks = await Task.find().sort({ createdAt: -1 }).lean();
        const payload = { success: true, count: tasks.length, data: tasks };

        cache.set(cache.keys.allTasks, payload);
        res.set('X-Cache', cache.missLabel);
        res.status(200).json(payload);
    } catch (err) {
        next(err);
    }
});

// GET /tasks/:id — single task, cached under its own key, 404 if not found
router.get('/:id', async (req, res, next) => {
    try {
        const key = cache.keys.task(req.params.id);

        const cached = cache.get(key);
        if (cached) {
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cached);
        }

        const task = await Task.findById(req.params.id).lean();

        if (!task) {
            // 404s are never cached
            return res.status(404).json({
                success: false,
                message: `Task not found with id ${req.params.id}`,
            });
        }

        const payload = { success: true, data: task };
        cache.set(key, payload);
        res.set('X-Cache', cache.missLabel);
        res.status(200).json(payload);
    } catch (err) {
        next(err);
    }
});

// POST /tasks — create a new task
router.post('/', validateCreateTask, async (req, res, next) => {
    try {
        console.log(`[API] POST /tasks received at ${new Date().toISOString()}`);

        const task = await Task.create(req.body);

        // The list changed -> the cached list is now stale
        cache.del(cache.keys.allTasks);

        // NOTIFY_MODE=sync is only for the sync-vs-async comparison:
        // it runs the notification BEFORE responding, so the client has to wait for it.
        const syncMode = process.env.NOTIFY_MODE === 'sync';
        if (syncMode) await handleTaskCreated(task, req.user);

        console.log(`[API] Response sent at ${new Date().toISOString()}`);
        res.status(201).json({ success: true, data: task });

        // Normal (async) mode: respond FIRST, then emit. The listener runs afterwards.
        if (!syncMode) taskEvents.emit('task-created', task, req.user);
    } catch (err) {
        next(err);
    }
});

// PUT /tasks/:id — update a task
router.put('/:id', validateUpdateTask, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with id ${req.params.id}`,
            });
        }

        // Both the list AND this task's own entry are stale
        cache.del(cache.keys.allTasks, cache.keys.task(req.params.id));

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
});

// DELETE /tasks/:id — delete a task
router.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with id ${req.params.id}`,
            });
        }

        cache.del(cache.keys.allTasks, cache.keys.task(req.params.id));

        res.status(200).json({ success: true, data: {} });

        // Respond first, then notify in the background
        taskEvents.emit('task-deleted', task, req.user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;