const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
})

socket.emit('joinRoom' , {username, room});

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