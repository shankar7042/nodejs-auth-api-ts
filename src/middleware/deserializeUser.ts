import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers["authorization"] || "").replace(
    /Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};
