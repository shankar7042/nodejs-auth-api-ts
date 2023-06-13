require("dotenv").config();
import express from "express";
import config from "config";
import { connectDB } from "./utils/connectDB";
import { log } from "./utils/logger";

const app = express();

app.get("/", (_, res) => {
  res.sendStatus(200);
});

const port = config.get<string>("port");
app.listen(port, () => {
  log.info(`Server started at port ${port}`);
  connectDB();
});
