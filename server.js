const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const {
  userJoin,
  getRoomUsers,
  userLeave,
  getCurrentUser,
} = require("./public/utils/user");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("*", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  var { username, room, password } = req.body;
  const error = "Invalid login credentials";
  room = room.split(" ").join("-");
  username && room && password
    ? res.render("chat", { username, room })
    : res.render("index", { error });
});

/******SOCKET IO SECTION START */

const io = socket(server);

// on connection
io.on("connection", (socket) => {
  console.log("New Connection >", socket.id + "...");
  socket.on("join", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      users: getRoomUsers(user.room),
    });

    socket.emit(
      "adminMessage",
      `📢 Hi ${username.toUpperCase()}, Welcome here.
      <br/>
      <br/>
 <span class="mt-2 bg-zinc-800 text-white rounded-lg px-4 py-1">New</span>`
    );

    socket.broadcast
      .to(user.room)
      .emit("adminMessage", `📢 ${username.toUpperCase()} joined.`);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  socket.on("myMessage", (msg) => {
    const { username, room } = getCurrentUser(socket.id);
    if (msg !== "") {
      socket.emit("sendMyMessage", { username, msg });
      socket.broadcast.to(room).emit("otherMessage", { username, msg });
    }
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "adminMessage",
        `📢 ${user.username.toUpperCase()} left`
      );
      console.log("A user has disconnected");
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

/******SOCKET IO SECTION END *******/

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
