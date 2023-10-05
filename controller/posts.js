import Posts from "../model/posts.js";
import User from "../model/user.js";
import mongoose from "mongoose";
import Video from "../model/video.js";
import Comment from "../model/comment.js";
export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find()
      .sort("-createdAt")
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "creator",
          model: User,
        },
        populate: {
          path: "replies",
          populate: {
            path: "creator",
            model: User,
          },
        },
      });
    // .populate("creator");
    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  const { content, image, userId } = req.body;
  try {
    const newPost = new Posts({
      content,
      image,
      creator: userId,
      createdAt: new Date().toISOString(),
    });
    await newPost.save();
    const postUser = await Posts.findOne({ _id: newPost._id }).populate(
      "creator"
    );
    res.status(200).json({
      status: true,
      data: postUser,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

export const editPost = async (req, res) => {
  const { content, image, idPost, idUser } = req.body;
  if (!mongoose.Types.ObjectId.isValid(idPost))
    return res.status(404).send("No post with that id");
  try {
    const post = await Posts.findById(idPost).populate("creator");
    if (post.creator._id.toString() !== idUser)
      return res.status(200).json({
        status: false,
        message: "You can't edit this post",
      });
    const updatePost = await Posts.findByIdAndUpdate(
      idPost,
      { content, image },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: updatePost,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  const { idPost, idUser } = req.body;
  try {
    const post = await Posts.findById(idPost).populate("creator");
    if (!post.likes.includes(idUser)) {
      const update = await Posts.findByIdAndUpdate(
        idPost,
        { $push: { likes: idUser } },
        { new: true }
      ).populate("creator");
      res.status(200).json({
        status: true,
        data: update,
      });
    } else {
      const update = await Posts.findByIdAndUpdate(
        idPost,
        { $pull: { likes: idUser } },
        { new: true }
      ).populate("creator");
      res.status(200).json({
        status: true,
        data: update,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUserLikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id).populate("creator");
    const users = await User.find({ _id: { $in: post.likes } }).limit(5);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { idUser, idPost } = req.body;
  try {
    const post = await Posts.findById(idPost).populate("creator");
    if (post.creator._id.toString() !== idUser)
      return res.status(200).json({
        status: false,
        message: "You can't delete this post",
      });
    // const deletePost = await Posts.findByIdAndDelete(idPost);
    // const deleteComment = await Comment.deleteMany({ postId: idPost });
    // res.status(200).json({
    //   status: true,
    //   message: "Delete post success",
    // });
    await Posts.findByIdAndDelete(idPost);
    await Comment.deleteMany({ postId: idPost });
    res.status(200).json({
      status: true,
      message: "Delete post success",
    });
  } catch (err) {
    res.status(200).json({
      status: false,
      message: err.message,
    });
  }
};

export const getPostByIdUser = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.find({ creator: id })
      .sort("-createdAt")
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "creator",
          model: User,
        },
        populate: {
          path: "replies",
          populate: {
            path: "creator",
            model: User,
          },
        },
      });
    res.status(200).json({
      status: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
