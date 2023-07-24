// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.URL_FRONTEND],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// Gửi file HTML chứa video từ webcam cho client
app.get("/", (req, res) => {
  res.send("Hello");
});

//socket
const arrUserInfo = [];

io.on("connection", (socket) => {
  console.log("a user connect"), socket.id;

  socket.on("NGUOI_DUNG_DANG_KY", (user) => {
    const isExist = arrUserInfo.some((e) => e.ten === user.ten);
    if (isExist) {
      return socket.emit("DANH_KY_THAT_BAI");
    }
    socket.peerId = user.peerId;

    arrUserInfo.push(user);
    socket.emit("DANH_SACH_ONLINE", arrUserInfo);

    socket.broadcast.emit("CO_NGUOI_DUNG_MOI", user);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnect"), socket.id;
    const index = arrUserInfo.findIndex(
      (user) => user.peerId === socket.peerId
    );
    arrUserInfo.splice(index, 1);

    io.emit("AI_DO_NGAT_KET_NOT", socket.peerId);
  });
});

const port = 5000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
