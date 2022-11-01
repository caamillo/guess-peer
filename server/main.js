const express = require('express');
const app = express();
const PORT = 5001;

const http = require('http').Server(app);
const cors = require('cors');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());

socketIO.on('connection', socket => {
    console.log(`${ socket.id } just connected`);
    socket.on('disconnect', () => {
        console.log(`${ socket.id } just disconnected`);
    });
});

app.get('/create', (req, res) => {
    res.json({ test: true })
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});