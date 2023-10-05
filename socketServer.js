let user = [];
export const socketServer = (socket) => {
  socket.on("join", (userId) => {
    console.log(userId);
  });
};
