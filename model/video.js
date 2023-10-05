import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

export default mongoose.model("video", videoSchema);
