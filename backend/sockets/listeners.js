import { io } from "../server";

const handleStartDisconnect = (reason) => {};

const handleDisconnect = (reason) => {};

const handleError = (err) => {};

const handleConnection = (socket) => {
  // Default listeners
  socket.on("disconnecting", handleStartDisconnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("error", handleError);

  // Custom listeners
};

io.on("connection", handleConnection);
