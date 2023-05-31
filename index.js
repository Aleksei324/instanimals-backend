const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*"
  }
});

const maxComments = 100;
let comments = [];

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('mensaje-enviado', ({ name, text }) => {
    const comment = { name, text };
    comments.push(comment);

    while (comments.length > maxComments) {
      comments.shift();
    }

    io.emit('mensaje-nuevo', comment);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
