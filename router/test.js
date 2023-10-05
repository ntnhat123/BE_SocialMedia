import express from "express";
import {
  createPost,
  register,
  login,
  createComment,
  reply,
  getPost,
  deletePost,
} from "../controller/test.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/createPost", createPost);
router.post("/createComment", createComment);
router.post("/reply", reply);
router.post("/deletePost", deletePost);
router.get("/", getPost);
export default router;
