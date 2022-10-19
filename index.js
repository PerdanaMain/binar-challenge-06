import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import userRoute from "./routes/UserRoute.js";

dotenv.config();

// ! db authenticate
try {
  await db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.log(error);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(userRoute);

app.listen(port, () => {
  console.log("Server running and listening at", port);
});
