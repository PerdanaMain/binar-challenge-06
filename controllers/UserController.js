import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
export const registAdmin = async (req, res) => {
  const { name, username, password } = req.body;
  const role = "admin";
  const users = await Users.findOne({ where: { username } });
  if (!name || !username || !password)
    return res.status(204).json({ msg: `Data can't be empty` });
  if (users) return res.status(406).json({ msg: "Username already exist!" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({ name, role, username, password: hashPassword });
    res
      .status(201)
      .json({ msg: `${username} for ${role} Created Successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: `${username} for ${role} fail to create!` });
  }
};
export const registUser = async (req, res) => {
  console.log(req.body);
  const { name, username, password } = req.body;
  const role = "member";
  const users = await Users.findOne({ where: { username } });
  if (!name || !username || !password)
    return res.status(204).json({ msg: `Data can't be empty` });
  if (users) return res.status(406).json({ msg: "Username already exist!" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({ name, role, username, password: hashPassword });
    res.status(201).json({ msg: `${username} Created Successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: `${username} fail to create!` });
  }
};
export const loginUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: { username: req.body.username },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password!" });
    const userId = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const role = user[0].role;
    const accessToken = jwt.sign(
      {
        userId,
        name,
        username,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1m",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, username, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ msg: `Welcome, ${name}`, role, accessToken });
  } catch (error) {
    console.log(error);

    res.status(404).json({ msg: "Username tidak ditemukan" });
  }
};
export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json({ msg: `Good Bye, ${user[0].name}` });
};
