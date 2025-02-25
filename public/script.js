const socket = io();

// Get username and room from URL
const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const room = params.get("room");

// Join room
socket.emit("joinRoom", { username, room });

// Handle incoming messages
socket.on("message", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
});

// Send message
document.getElementById("sendBtn").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    if (message) {
        socket.emit("sendMessage", message);
        messageInput.value = "";
    }
});
