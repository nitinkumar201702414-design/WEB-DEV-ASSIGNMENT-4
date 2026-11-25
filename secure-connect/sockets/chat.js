const jwt = require('jsonwebtoken');
const appEvents = require('../events/appEvents');

module.exports = function initChat(io) {
  // Authenticate every socket connection with the JWT
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('No token provided'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', (room = 'general') => {
      socket.join(room);
      socket.data.room = room;
      console.log(`${socket.id} joined room ${room}`);
      io.to(room).emit('system', `${socket.user.username} joined ${room}`);
    });

    socket.on('chatMessage', ({ room = 'general', text } = {}) => {
      if (!text || !text.trim()) return;
      if (!socket.rooms.has(room)) return; // must join first
      const payload = {
        room,
        username: socket.user.username,
        text: text.trim(),
        time: new Date().toISOString(),
      };
      appEvents.emit('chat:message', payload);
      io.to(room).emit('chatMessage', payload);
    });

    socket.on('typing', (room = 'general') =>
      socket.to(room).emit('typing', socket.user.username)
    );

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.data.room)
        io.to(socket.data.room).emit('system', `${socket.user.username} left`);
    });
  });
};
