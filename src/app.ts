require("dotenv").config();
import express from "express";
import config from "config";

const app = express();

app.get("/", (_, res) => {
  res.sendStatus(200);
});

const port = config.get<string>("port");
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
