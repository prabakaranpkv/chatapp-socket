import { Server } from "socket.io";

const PORT = process.env.PORT || 9000;

const io = new Server(PORT, {
  cors: {
    origin: "https://chattingapp-client.netlify.app",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("User Connected");

  //connect
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  //send messages
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(text, senderId, user);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("user is Disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
