import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  getUsers,
  registUser,
  loginUser,
  logoutUser,
  registAdmin,
} from "../controllers/UserController.js";

const router = express.Router();

// ? Endpoint all users
router.post("/regist", registUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.get("/token", refreshToken);
router.get("/users", verifyToken, getUsers);

// ? Endpoint non-member
const prefix = "/adm";
router.post(prefix + "/regist", verifyUser, registAdmin);

export default router;
