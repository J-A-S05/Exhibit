import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const io = require("socket.io")(PORT, {
    cors: {
      origin: FRONTEND_URL,
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected." , socket.id);
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      // io.emit('updateUserStatus', { userId, status: 'online' });
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      // console.log(users)
      if(user) io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
      else{
        console.log("no user")
      }
    });

    // socket.on('userLoggedIn', (userId) => {
    //   onlineUsers[userId] = socket.id;
    //   io.emit('updateUserStatus', { userId, status: 'online' });
    // });
  
    //when disconnect
    socket.on("disconnect", (userId) => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
















//   const onlineUsers = {};

// io.on('connection', (socket) => {
//   console.log('A user connected', socket.id);

//   // When a user logs in, add them to the online users list
//   socket.on('userLoggedIn', (userId) => {
//     onlineUsers[userId] = socket.id;
//     io.emit('updateUserStatus', { userId, status: 'online' });
//   });

//   // When a user logs out, remove them from the online users list
//   socket.on('disconnect', () => {
//     for (let userId in onlineUsers) {
//       if (onlineUsers[userId] === socket.id) {
//         delete onlineUsers[userId];
//         io.emit('updateUserStatus', { userId, status: 'offline' });
//         break;
//       }
//     }
//   });

//   // Handle logout event explicitly if you have such functionality
//   socket.on('userLoggedOut', (userId) => {
//     delete onlineUsers[userId];
//     io.emit('updateUserStatus', { userId, status: 'offline' });
//   });
// });

