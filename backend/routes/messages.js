const { Server } = require('socket.io');
const Message = require('../models/Messages');

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send existing messages
    Message.find().sort({ timestamp: 1 }).then((messages) => {
      socket.emit('chat-history', messages);
    });

    // Listen to new messages
    socket.on('new-message', async (data) => {
      const message = new Message(data);
      await message.save();
      io.emit('receive-message', message); // broadcast to all
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
