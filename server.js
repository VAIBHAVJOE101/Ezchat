const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/formatMessage');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static('public'));

io.on('connection', (socket) => {

   socket.on('joinRoom', ({ username, room }) => {

      const user = userJoin(socket.id, username, room);
      socket.join(user.room);
      //send message to client when he connect (emmiting to the client)
      socket.emit('message', formatMessage(username, 'Welcome to the chatroom!'));

      //broadcast a message when a user joins(emit to everyone except himself)
      socket.broadcast.to(user.room).emit('message', formatMessage(username, `${user.username} has joined the room .`));

      //send room users 
      io.to(user.room).emit('roomUsers', {
         room: user.room,
         users: getRoomUsers(user.room)
      });
   })


   socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
   })

   //send a message when the user leaves the room 
   socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
         io.to(user.room).emit('message', formatMessage(user.username, `${user.username} has left the room`));

         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
         });
      }


   })
})


server.listen(PORT, () => {
   console.log(`The server is running on port ${PORT}`);
})