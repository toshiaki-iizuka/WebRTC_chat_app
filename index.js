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

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
