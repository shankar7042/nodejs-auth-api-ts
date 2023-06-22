require("dotenv").config();
import express from "express";
import config from "config";
import { connectDB } from "./utils/connectDB";
import { log } from "./utils/logger";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
const app = express();
app.use(express.json());

app.use(deserializeUser);
app.use(routes);

const port = config.get<string>("port");
app.listen(port, () => {
  log.info(`Server started at port ${port}`);
  connectDB();
});
