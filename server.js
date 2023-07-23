// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const users = {}; // Danh sách người dùng kết nối

// Gửi file HTML chứa video từ webcam cho client
app.get("/", (req, res) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  console.log("a user connect");

  // Xử lý sự kiện candidate từ client
  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });

  // Xử lý sự kiện offer từ client
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  // Xử lý sự kiện answer từ client
  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });
});

const port = 5000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
