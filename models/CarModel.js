import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Cars = db.define(
  "cars",
  {
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

(async () => {
  await db.sync();
})();
export default Cars;
