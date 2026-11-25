// Event-driven features using Node.js EventEmitter
const EventEmitter = require('events');

class AppEmitter extends EventEmitter {}
const appEvents = new AppEmitter();

appEvents.on('user:registered', (user) =>
  console.log(`[event] New user registered: ${user.username} (${user.email})`)
);
appEvents.on('user:login', (user) =>
  console.log(`[event] Login: ${user.username} at ${new Date().toISOString()}`)
);
appEvents.on('note:created', (note) =>
  console.log(`[event] Note created: "${note.title}" by owner ${note.owner}`)
);
appEvents.on('note:updated', (note) =>
  console.log(`[event] Note updated: "${note.title}"`)
);
appEvents.on('note:deleted', (id) => console.log(`[event] Note deleted: ${id}`));
appEvents.on('chat:message', ({ room, username, text }) =>
  console.log(`[${room}] ${username}: ${text}`)
);

module.exports = appEvents;
