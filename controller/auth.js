import jwt from "jsonwebtoken";
import byc from "bcryptjs";
import User from "../model/user.js";
const test = "test";
export const register = async (req, res) => {
  const { fullName, email, password, gender } = req.body;
  try {
    const users = await User.findOne({ email });
    if (users) {
      return res.status(200).json({
        status: false,
        message: "User already exists",
      });
    }
    if (!validateEmail(email)) {
      return res.status(200).json({
        status: false,
        message: "Invalid email",
      });
    }
    if (password.length < 6) {
      return res.status(200).json({
        status: false,
        message: "Password must be at least 6 characters",
      });
    }
    const hashPassword = await byc.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashPassword,
      gender,
    });
    const token = jwt.sign({ email: user.email, id: user._id }, test, {
      expiresIn: "30d",
    });
    res.status(200).json({
      status: true,
      message: "Register success",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(200).json({
      status: false,
      message: "Email and password required",
    });
  try {
    if (!validateEmail(email))
      return res.status(200).json({
        status: false,
        message: "Invalid email",
      });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        status: false,
        message: "User doesn't exist",
      });
    const isPasswordCorrect = await byc.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(200).json({
        status: false,
        message: "Invalid credentials",
      });
    const token = jwt.sign({ email: user.email, id: user._id }, test, {
      expiresIn: "30d",
    });
    res.status(200).json({
      status: true,
      message: "Login success",
      user,
      token,
    });
  } catch (err) {
    res.status(200).json({
      status: false,
      message: err.message,
    });
  }
};

export const loginByToken = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(200).json({
      status: false,
      message: "Token required",
    });
  try {
    const decode = jwt.verify(token, test);
    const user = await User.findById(decode.id);
    if (!user)
      return res.status(200).json({
        status: false,
        message: "User doesn't exist",
      });
    return res.status(200).json({
      status: true,
      message: "Login success",
      user,
      token,
    });
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: "Invalid token",
    });
  }
};

export const googleLogin = async (req, res) => {
  const { email, fullName, tokenId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ email: user.email, id: user._id }, test, {
        expiresIn: "30d",
      });
      return res.status(200).json({ user, token });
    }
    const newUser = await User.create({
      fullName,
      email,
      tokenId,
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, test, {
      expiresIn: "30d",
    });
    res.status(200).json({ newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
