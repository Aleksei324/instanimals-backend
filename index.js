const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const headers = {
  cors: {
    origin: "*"
  }
}
app.use(cors(headers));

const httpserver = http.createServer(app);
const io = new Server(httpserver);

app.get('/', (req, res) => {
  <div>
    <h1>Servidor del backend en funcionamiento</h1>
    <h2>Sockets del chat en el puerto 4000</h2>
  </div>
});

const maxComments = 50;
let comments = [];

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('init-array', JSON.stringify(comments))

  socket.on('mensaje-enviado', (payload) => {
    console.log(`Mensaje por ${payload.name}: ${payload.text}`)

    comments.push(payload);

    while (comments.length > maxComments) {
      comments.shift();
    }

    socket.broadcast.emit('mensaje-nuevo', payload);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

httpserver.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});
