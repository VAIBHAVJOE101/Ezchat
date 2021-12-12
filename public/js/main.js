const socket = io();


socket.on('message', (message)=>{
   console.log(message);
})

socket.on('connection', (connection)=>{
   console.log(connection);
})