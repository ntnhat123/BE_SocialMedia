import express from "express";
import {
  editUser,
  follow,
  getUserById,
  searchUsers,
  getAllUser,
  unFollow,
} from "../controller/user.js";
import { auth } from "../middleware/authentication.js";
const router = express.Router();

router.get("/search", searchUsers);
router.get("/user/:id", getUserById);
router.post("/editUser/:id", editUser);
router.post("/follow", auth, follow);
router.post("/unFollow", auth, unFollow);
router.get("/userNotMe/:id", auth, getAllUser);

export default router;
