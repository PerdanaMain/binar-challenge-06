import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.status(401).json({ msg: "Unauthorize" });

    const user = await Users.findAll({
      where: { refresh_Token: refreshToken },
    });
    if (!user[0]) return res.status(403).json({ msg: "Forbidden" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const username = user[0].username;
        const role = user[0].role;
        const accessToken = jwt.sign(
          { userId, name, username, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {}
};
