const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const userList = document.getElementById("users");
const roomName = document.getElementById("room-name");


const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
})

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
   outputRoomName(room);
   outputUsers(users);
})

socket.on('message', (message) => {

   outputMessage(message);

   //scrolldown
   chatMessage.scrollTop = chatMessage.scrollHeight;
})


chatForm.addEventListener('submit', (e) => {
   e.preventDefault();

   const msg = e.target.elements.msg.value;

   socket.emit('chatMessage', msg);

   //clear input 
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();

})

const outputMessage = ({ username, text, time }) => {
   const div = document.createElement('div');
   div.classList.add("message");
   div.innerHTML = `
   <p class="meta">${username}<span>${time}</span></p>
   <p class="text">${text}</p>
   `
   document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
   roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
   userList.innerHTML = '';
   users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
   });
}