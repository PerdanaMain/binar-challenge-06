import { Sequelize } from "sequelize";

const db = new Sequelize("challenge_06", "root", "firman2307", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
