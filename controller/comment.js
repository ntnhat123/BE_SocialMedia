import Comment from "../model/comment.js";
import Posts from "../model/posts.js";
import User from "../model/user.js";
import Reply from "../model/reply.js";
export const createComment = async (req, res) => {
  try {
    const { idPost, idUser, content } = req.body;
    if (!idPost) return res.status(400).json({ message: "idPost is required" });
    const post = await Posts.findById(idPost);
    const newComment = new Comment({
      content,
      creator: idUser,
      postId: idPost,
      postUserId: idUser,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    await newComment.populate("creator");
    res.status(200).json({
      status: true,
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const likeComment = async (req, res) => {
  const { idUser, idComment, idPost } = req.body;

  try {
    const comment = await Comment.findById(idComment);
    if (!comment.likes.includes(idUser)) {
      const update = await Comment.findByIdAndUpdate(
        idComment,
        { $push: { likes: idUser } },
        { new: true }
      );
      res.status(200).json({
        status: true,
        data: update,
      });
    } else {
      const update = await Comment.findByIdAndUpdate(
        idComment,
        { $pull: { likes: idUser } },
        { new: true }
      );
      res.status(200).json({
        status: true,
        data: update,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { content, idUser, idComment } = req.body;
    const comment = await Comment.findById(idComment);
    const reply = new Comment({
      content,
      creator: idUser,
      postId: comment.postId,
      postUserId: comment.postUserId,
    });
    await reply.save();
    comment.replies.push(reply._id);
    await comment.save();
    await reply.populate("creator");
    res.status(200).json({
      status: true,
      data: reply,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ postId: id })
      .populate("creator")
      .populate({
        path: "reply",
        populate: {
          path: "creator",
        },
      });
    res.status(200).json({
      status: true,
      data: comments,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

export const editComment = async (req, res) => {
  try {
    const { idComment, content, idUser } = req.body;
    const comment = await Comment.findById(idComment).populate("creator");
    if (comment.creator._id.toString() !== idUser)
      return res.status(400).json({ message: "You can't edit this comment" });
    const updateComment = await Comment.findByIdAndUpdate(
      idComment,
      { content },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: updateComment,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { idComment, idUser } = req.body;
    const comment = await Comment.findById(idComment).populate("creator");
    if (comment.creator._id.toString() !== idUser)
      return res.status(400).json({ message: "You can't delete this comment" });
    await Comment.findByIdAndDelete(idComment);
    res.status(200).json({
      status: true,
      message: "Delete comment successfully",
    });
  } catch (error) {}
};
