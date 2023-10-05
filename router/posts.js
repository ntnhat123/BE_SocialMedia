import express from "express";
import {
  createPost,
  getPosts,
  likePost,
  getAllUserLikePost,
  deletePost,
  editPost,
  getPostByIdUser,
} from "../controller/posts.js";
import { auth } from "../middleware/authentication.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
// router.post("/", auth, createPost);
router.post("/", auth, createPost);
router.get("/", getPosts);

router.post("/editPost", auth, editPost);
router.post("/deletePost", auth, deletePost);
router.get("/getPostByIdUser/:id", auth, getPostByIdUser);
router.post("/likePost", auth, likePost);
router.get("/:id/user", getAllUserLikePost);

export default router;
