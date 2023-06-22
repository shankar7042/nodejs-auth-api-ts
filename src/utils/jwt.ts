import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
  object: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions
) {
  const signInKey = Buffer.from(config.get<string>(key), "base64").toString(
    "ascii"
  );

  return jwt.sign(object, signInKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  const publicKey = Buffer.from(config.get<string>(key), "base64").toString(
    "ascii"
  );
  try {
    const object = jwt.verify(token, publicKey) as T;
    return object;
  } catch (error) {
    return null;
  }
}
