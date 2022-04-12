import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

import app from './app.js';
import { mongoDBOn } from './middleware/mongoConfig.js';

dotenv.config();

const server = http.createServer(app);
const port = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL]
  }
});

const socketUsers = {};

const serverUser = {
  username: 'Antro',
  pic: 'https://i.pravatar.cc/50?img=67'
};

io.on('connection', (socket) => {

  socket.on('newUser', (user) => {
    socketUsers[socket.id] = user;
    const message = `Welcome ${user.username}`;
    const hello = `${socketUsers[socket.id]?.username} has connected`;
    const payload = { 
      socketUser: serverUser, 
      message 
    };
    socket.emit('greeting', payload);
    payload.message = hello;
    socket.broadcast.emit('hello', payload);
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    const message = `${socketUsers[socket.id]?.username} has disconnected`;
    const payload = { 
      socketUser: serverUser, 
      message 
    };
    socket.broadcast.emit('goodbye', payload);
    delete socketUsers[socket.id];
  })

});

mongoDBOn().then(async () => {
  server.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
});
