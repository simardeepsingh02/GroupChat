const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Store connected users with their names
const users = new Map();

wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    ws.send('Please enter your name:');

    ws.once('message', (name) => {
        // Ensure name is a string before trimming
        

        name = name.toString().trim();
        
        if (name.length === 0) {
            ws.send('Invalid name. Connection closed.');
            ws.close();
            return;
        }

        // Add user to the list of connected users
        users.set(ws, name);
        sendOnlineUsers()
        // Broadcast user joined message
        broadcast(`${name} joined the chat.`);

        ws.on('message', (message) => {
            // Broadcast the message to all connected users
            broadcast(`${name}: ${message}`);
        });

        ws.on('close', () => {

            console.log(`WebSocket connection closed: ${name}`);
            
            // Remove user from the list of connected users
            users.delete(ws);
            sendOnlineUsers()
            // Broadcast user left message
            broadcast(`${name} left the chat.`);
        });
    });
});

function sendOnlineUsers() {
    const onlineUsers = Array.from(users.values());
    const onlineUsersString = `Online users: ${onlineUsers.join(', ')}`;
    broadcast(onlineUsersString);

    // Send the updated list of names to all clients
    broadcastOnlineUsersList(onlineUsers);
}

function broadcastOnlineUsersList(usersList) {
    users.forEach((user, ws) => {
        if (user.readyState === WebSocket.OPEN) {
            const onlineUsersString = `Online users: ${usersList.join(', ')}`;
            user.send(onlineUsersString);
        }
    });
}

function broadcast(message) {
    users.forEach((userName, user) => {
        if (user.readyState === WebSocket.OPEN) {
            user.send(message);
        }
    });
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
