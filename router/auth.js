import express from "express";
import {
  login,
  register,
  googleLogin,
  loginByToken,
} from "../controller/auth.js";
const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.post("/google", googleLogin);
route.post("/loginByToken", loginByToken);
export default route;
