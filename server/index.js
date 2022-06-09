const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');
const {addUser, removeUser, getUser, getAllRoomUsers} = require('./users.js');

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

    // Connect and add a user to the room
    socket.on('join', ({ name, room},callback)=>{

        const { user, error} = addUser({id: socket.id, name, room});

        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `Hi ${user.name}! Welcome to the room ${user.room}`});

        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `Attention everyone! ${user.name} has joined.`});

        socket.join(user.room);

        callback;
    });

    socket.on('sendMessage',(message, callback)=> {
        const user = getUser(socket.id);

        //Send user message to the room
        io.to(user.room).emit('message', {user: user.name, text: message});

    })
});

    

app.use(router);

server.listen(PORT, () => console.log(`Server started  on port ${PORT}`))