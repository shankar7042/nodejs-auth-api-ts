import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import sendEmail from "../utils/mailer";
import { log } from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;
  try {
    const user = await createUser(body);
    await sendEmail({
      from: "test@test.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}, id: ${user._id}`,
    });
    return res.send("User created successfully");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(error);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  if (user.verified) {
    return res.send("User already verified");
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    "If a user with that email is registered you will receive a password reset email";

  const email = req.body.email;
  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendEmail({
    from: "test@test.com",
    to: user.email,
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`,
  });

  log.debug(`Reset Password mail sent to user with email: ${email}`);

  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset your password");
  }

  user.password = password;
  user.passwordResetCode = null;

  await user.save();
  return res.send("Successfully updated password");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
