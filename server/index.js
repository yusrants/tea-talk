const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');

const PORT = process.env.PORT || 5000;

// initialize the app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log(" A new connection joined !!!!! ");

    socket.on('disconnect',() => {
        console.log('user has left')
    });

    socket.on('join', ({ name, room},callback)=>{
        console.log(name, room);
    
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server started  on port ${PORT}`))