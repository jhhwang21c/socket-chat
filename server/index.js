const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const history = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (name, room) => {
    socket.join(room);
    console.log(`User with ID: ${name} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    history.push({
      room: data.room,
      user: data.author,
      message: data.message,
      time: data.time
    });
    console.log(history);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});