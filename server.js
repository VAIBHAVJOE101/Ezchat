const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT ;


app.use(express.static('public')); 

io.on('connection', (socket)=>{
   console.log("Connection established");

   //send message to client when he connect (emmiting to the client)
   socket.emit('message', 'Welcome to the chatroom!');

   //broadcast a message when a user joins
   socket.broadcast.emit('connection' , 'A user has joined the room .');

})


server.listen(PORT, ()=>{
   console.log(`The server is running on port ${PORT}`);
})