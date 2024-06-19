const express = require('express');
const cors = require("cors");
const routes = require('./routes');
require('./database');
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    path: '/api/socket.io',
    cors: {
        origin: process.env.APP_URL
    }
});

const connectedUsers = {};

io.on('connect', (socket) => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
        connectedUsers[userId] = socket.id;
    }

    socket.on('send_notification', (user_ids) => {
        if (Array.isArray(user_ids)) {
            user_ids.forEach((user_id) => {
                const targetSocketId = connectedUsers[user_id];
                if (targetSocketId) {
                    io.to(targetSocketId).emit('notification_received');
                    io.to(targetSocketId).emit('notification_received_dashboard');
                }
            });
        } else {
            const targetSocketId = connectedUsers[user_ids];
            if (targetSocketId) {
                io.to(targetSocketId).emit('notification_received');
                io.to(targetSocketId).emit('notification_received_dashboard');
            }
        }
    });

    socket.on('update_notification', (user_id) => {
        const targetSocketId = connectedUsers[user_id];
        if (targetSocketId) {
            io.to(targetSocketId).emit('notification_refresh');
            io.to(targetSocketId).emit('notification_refresh_dashboard');
        }
    });

    socket.on('disconnect', () => {
        if (userId) {
            delete connectedUsers[userId];
        }
    });
});

server.listen(
    process.env.PORT,
    () => console.log(`it's alive on http://localhost:${process.env.PORT}`)
)