
const socket = new WebSocket('ws://main--chatomegal.netlify.app');

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});


socket.addEventListener('message', (event) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${event.data}</p>`;
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    socket.send(message);
    messageInput.value = '';
}

