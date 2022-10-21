import Cars from "../models/CarModel.js";
import jwt from "jsonwebtoken";

export const getCars = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    req.role = decoded.role;
  });

  try {
    const cars = await Cars.findAll();
    res.status(200).json(cars);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Bad Request!" });
  }
};
export const getCarById = async (req, res) => {};
export const saveCar = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    req.role = decoded.role;
  });
  //res.status(200).json({ username: user.username, role: user.role });
  const { name, price, type } = req.body;
  const createdBy = req.username;
  const updatedBy = req.username;
  if (!name)
    return res.status(204).json({ msg: `${name} tidak boleh kosong!` });
  if (!price)
    return res.status(204).json({ msg: `${price} tidak boleh kosong!` });
  if (!type)
    return res.status(204).json({ msg: `${type} tidak boleh kosong!` });
  try {
    await Cars.create({
      name,
      price,
      type,
      createdBy,
      updatedBy,
    });
    res.status(201).json({ msg: `Mobil ${name} Berhasil dibuat` });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(400).json({ msg: "Bad Request!" });
  }
};
export const updateCar = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    req.role = decoded.role;
  });
  const { id } = req.params;
  const { name, price, type } = req.body;
  const updatedBy = req.username;

  try {
    await Cars.update({ name, price, type, updatedBy }, { where: { id } });
    res.status(200).json({ msg: `Mobil ${name} Updated Successfully!` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Bad Request!" });
  }
};
export const deleteCar = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    req.role = decoded.role;
  });

  const { id } = req.params;
  const car = await Cars.findOne({ where: { id } });
  try {
    await Cars.destroy({ where: { id } });
    res.status(200).json({ msg: `Mobil ${car.name} deleted successfully! ` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Bad Request!" });
  }
};
