const EventEmitter = require('events');

// One shared emitter for the whole app. Any file that does
// require('./events') gets this same instance.
class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();