const app = require('express')();
const server = require('node:http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (_req, res) => {
  res.send('Server is running.');
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
