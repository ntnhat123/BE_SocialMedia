import { Post, User, Comment } from "../model/test.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    res.status(200).json(user);
  } catch (error) {}
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({
      email: email,
      password: password,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {}
};

export const createPost = async (req, res) => {
  const { content, idUser } = req.body;
  try {
    const post = new Post({
      content: content,
      creator: idUser,
    });
    await post.save();
    await post.populate("creator");

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;
    const post = await Post.findById(postId);
    const comment = new Comment({
      content,
      creator: userId,
      postId: postId,
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();
    await comment.populate("creator");
    res.status(201).json(comment);
  } catch (error) {}
};

export const reply = async (req, res) => {
  try {
    const { content, userId, commentId } = req.body;
    const comment = await Comment.findById(commentId);
    const reply = new Comment({
      content,
      creator: userId,
      postId: comment.postId,
    });
    await reply.save();
    comment.replies.push(reply._id);
    await comment.save();
    await reply.populate("creator");
    res.status(201).json(reply);
  } catch (error) {}
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ postId: postId });
    res.status(200).json({ message: "Delete success" });
  } catch (error) {}
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
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
      })
      .populate("creator");

    res.json(posts);
  } catch (error) {}
};
