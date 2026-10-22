const taskEvents = require('./events');
const User = require('./models/User');

const stamp = () => new Date().toISOString();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated slow work (sending an email, push notification, etc.).
// Change with NOTIFY_DELAY_MS in .env (default 2000 ms).
const delayMs = () => (process.env.NOTIFY_DELAY_MS !== undefined ? Number(process.env.NOTIFY_DELAY_MS) : 2000);

// ---------- handlers ----------

async function handleTaskCreated(task, user) {
    console.log(`[Notification] Handler started   at ${stamp()}`);

    await sleep(delayMs()); // pretend this is slow background work

    // Look up who the task belongs to (a real DB call you don't want in the request path)
    const owner = user && user.id ? await User.findById(user.id).select('email').lean() : null;
    const assignedTo = owner ? owner.email : user && user.id ? user.id : 'unknown';

    // Demo only: lets you trigger a failure to see the 'error' listener work
    if (task.title && task.title.toLowerCase().includes('simulate-error')) {
        throw new Error('Simulated failure inside task-created handler');
    }

    console.log(
        `[Notification] Task "${task.title}" created | assigned user: ${assignedTo} | at ${stamp()}`
    );
    console.log(`[Notification] Handler finished  at ${stamp()}`);
}

async function handleTaskDeleted(task, user) {
    const who = user && user.id ? user.id : 'unknown';
    console.log(`[Notification] Task "${task.title}" was DELETED by user ${who} at ${stamp()}`);
}

// Wraps a handler so that:
//  - it starts in a microtask, i.e. after the code that called emit() has finished
//  - ANY error (sync throw or rejected promise) is forwarded to the 'error' event
//    instead of crashing the server with an unhandled rejection
function safe(handler) {
    return (...args) => {
        Promise.resolve()
            .then(() => handler(...args))
            .catch((err) => taskEvents.emit('error', err));
    };
}

// ---------- register listeners (runs once, when this file is first required) ----------

taskEvents.on('task-created', safe(handleTaskCreated));
taskEvents.on('task-deleted', safe(handleTaskDeleted));

// Without this, emitting 'error' with no listener THROWS and can crash the process
taskEvents.on('error', (err) => {
    console.error(`[Notification:ERROR] ${err.message} at ${stamp()}`);
});

module.exports = { handleTaskCreated, handleTaskDeleted };