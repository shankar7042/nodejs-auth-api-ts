import mongoose from "mongoose";
import config from "config";
import { log } from "./logger";

const dbUrl = config.get<string>("dbUrl");

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    log.info("Connected to db");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export { connectDB };
