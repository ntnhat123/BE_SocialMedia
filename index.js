import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./router/auth.js";
import user from "./router/user.js";
import post from "./router/posts.js";
import comment from "./router/comment.js";
import test from "./router/test.js";
import video from "./router/video.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const port = 5000;

const URL = "mongodb+srv://nhatnguyentk2:nhat12345678@cluster0.ngu51pw.mongodb.net/Social_BE?retryWrites=true&w=majority";

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", auth);
app.use("/auth", user);
app.use("/post", post);
app.use("/comment", comment);
app.use("/test", test);
app.use("/video", video);

//socket

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });

  // Handle other socket events as needed
});

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    httpServer.listen(port, () => console.log(`Server running on port: ${port}`))
  }
  )
  .catch((error) => console.log(error.message));

