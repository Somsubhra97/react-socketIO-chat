const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');

const app = express();
app.use(cors());
app.use(router);


const server=app.listen(5000, () => console.log(`Server has started.`));
const io = socketio(server);


//socket.emit is for current user
//io.emit is for all
//socket.broadcast for braodcasting
io.on('connect', (socket) => {  

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });////    
    if(error) return callback(error);   

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    callback();
  });

  const user = getUser(socket.id);

  socket.on('sendTyping',()=>{
     io.to(user.room).emit('typing',{user: `${user.name} is typing...`})
  })


  socket.on('sendMessage', (message, callback) => {
     io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
  });


  socket.on('disconnect', () => {//unmount method
    const user = removeUser(socket.id);/////

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      socket.emit('message', { user: 'admin', text: `YOU LEFT.`});
      
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

