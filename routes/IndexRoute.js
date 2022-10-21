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
import {
  getCars,
  saveCar,
  updateCar,
  deleteCar,
  getCarById,
} from "../controllers/CarController.js";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUI from "swagger-ui-express";

const swaggerDocument = yaml.load(fs.readFileSync("api-docs.yaml", "utf8"));

const router = express.Router();

router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ? Endpoint all users
router.post("/regist", registUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.get("/token", refreshToken);
router.get("/users", verifyToken, getUsers);

// ? Endpoint non-member
const prefix = "/adm";
router.post(prefix + "/regist", verifyUser, registAdmin);

// ? Endpoint CRUD Cars
router.get("/getcars", verifyUser, getCars);
router.post("/createcar", verifyUser, saveCar);
router.put("/updatecar/:id", verifyUser, updateCar);
router.delete("/deletecar/:id", verifyUser, deleteCar);

export default router;
