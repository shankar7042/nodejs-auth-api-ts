import logger from "pino";
import config from "config";
import dayjs from "dayjs";

const logLevel = config.get<string>("logLevel");

export const log = logger({
  transport: {
    target: "pino-pretty",
  },
  //   level: logLevel,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
