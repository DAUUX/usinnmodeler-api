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

io.on('connect', socket => {
    console.log('usuário conectado', socket.id);

    socket.on('send_notification', (user_ids) => {
        if (Array.isArray(user_ids)) {
            user_ids.forEach(user_id => {
                io.emit('notification_received', {
                    user_id: user_id
                });
                io.emit('notification_received_dashboard', {
                    user_id: user_id
                });
            });
        } else {
            io.emit('notification_received', {
                user_id: user_ids
            });
            io.emit('notification_received_dashboard', {
                user_id: user_ids
            });
        }
    });

    socket.on('update_notification', (user_id) => {
        io.emit('notification_refresh', {
            user_id: user_id
        })
        io.emit('notification_refresh_dashboard', {
            user_id: user_id
        })
    })

    socket.on('disconnect', () => {
        console.log('usuário desconectado', socket.id);
    });
});

server.listen(
    process.env.PORT,
    () => console.log(`it's alive on http://localhost:${process.env.PORT}`)
)