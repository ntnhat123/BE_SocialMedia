import express from "express";
import {
  createComment,
  likeComment,
  replyComment,
  getComment,
  editComment,
  deleteComment,
} from "../controller/comment.js";
import { auth } from "../middleware/authentication.js";
const router = express.Router();

router.get("/getComment/:id", auth, getComment);
router.post("/editComment", auth, editComment);
router.post("/deleteComment", auth, deleteComment);
router.post("/createComment", auth, createComment);
router.post("/likeComment", auth, likeComment);
router.post("/replyComment", auth, replyComment);
export default router;
