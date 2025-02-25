const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Store active users in rooms
const users = {};

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };

        // Notify others in the room
        socket.to(room).emit("message", { user: "System", text: `${username} has joined the chat!` });
    });

    socket.on("sendMessage", (message) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit("message", { user: user.username, text: message });
        }
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            socket.to(user.room).emit("message", { user: "System", text: `${user.username} left the chat.` });
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
