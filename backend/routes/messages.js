const Message = require('../models/Messages');
const { Server } = require('socket.io');

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // ✅ Frontend origin
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('get-history', async () => {
      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit('chat-history', messages);
    });

    socket.on('new-message', async (msg) => {
      const saved = await Message.create(msg);
      io.emit('receive-message', saved); // broadcast to all clients
    });
  });

  // io.on('connection', (socket) => {
  //   debugger;
  //   console.log('User connected:', socket.id);

  //   // Send chat history
  //   Message.find().sort({ timestamp: 1 }).then((messages) => {
  //     socket.emit('chat-history', messages);
  //   });

  //   // New message
  //   socket.on('new-message', async (data) => {
  //     const message = new Message(data);
  //     await message.save();
  //     io.emit('receive-message', message); // Broadcast to all
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('User disconnected:', socket.id);
  //   });
  // });

  return io;
};
