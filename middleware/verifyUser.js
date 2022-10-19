import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    req.role = decoded.role;
    console.log(req.username);
    console.log(req.role);
    if (req.role === "member")
      return res.status(401).json({ msg: "Sorry, Member not allowed" });
    next();
  });
};
