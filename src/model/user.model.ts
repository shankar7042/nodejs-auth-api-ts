import {
  pre,
  prop,
  modelOptions,
  Severity,
  getModelForClass,
  DocumentType,
  index,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import nanoid from "nanoid";
import { log } from "../utils/logger";

export const privateFields = [
  "__v",
  "password",
  "passwordResetCode",
  "verificationCode",
];

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, lowercase: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid.nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async verifyPassword(this: DocumentType<User>, userPassword: string) {
    try {
      return await argon2.verify(this.password, userPassword);
    } catch (error) {
      log.error(error, "Could not verify password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
