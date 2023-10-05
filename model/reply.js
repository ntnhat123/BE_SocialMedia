import mongoose from "mongoose";
const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    creator: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("reply", replySchema);
