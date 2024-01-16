import { ORIGIN } from "@/config";
import { API_ROUTES, HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import UserRepository from "@/repositories/userRepository";
import { CreateUserInput } from "@/schemas/user.schema";
import Mailer from "@/utils/mailer";
import {
  generateSecureCode,
  hashVerificationCode,
} from "@/utils/verificationCode";
import argon2 from "argon2";

class AuthService {
  private userRepository: UserRepository;
  private mailer: Mailer;

  constructor(userRepository: UserRepository, mailer: Mailer) {
    this.userRepository = userRepository;
    this.mailer = mailer;
  }
  public async createUser(userData: CreateUserInput): Promise<string> {
    const { username, email, password, passwordConfirmation } = userData;

    const existingUserByEmail = await this.userRepository.findUniqueUser({
      email,
    });
    if (existingUserByEmail) {
      throw new HttpException(HttpStatusCodes.CONFLICT, "Email already exists");
    }

    if (password !== passwordConfirmation) {
      throw new HttpException(
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        "Password and password confirmation do not match"
      );
    }

    const hashPassword = await argon2.hash(password);

    const { verificationCode, verifyCode } = generateSecureCode();
    const user = await this.userRepository.createUser({
      username,
      email,
      password: hashPassword,
      verificationCode,
    });

    const redirectUrl = `${ORIGIN}/${API_ROUTES.AUTH}/${API_ROUTES.VERIFY_EMAIL}/${verifyCode}`;
    await this.mailer.sendVerificationCode(
      redirectUrl,
      user.username,
      user.email
    );

    return user.email;
  }

  public async verifyUserEmail(verificationCode: string) {
    const hashedVerificationCode = hashVerificationCode(verificationCode);

    const existingUser = await this.userRepository.findUniqueUser({
      verificationCode: hashedVerificationCode,
    });

    if (!existingUser)
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");

    if (existingUser.verified)
      throw new HttpException(
        HttpStatusCodes.BAD_REQUEST,
        "User is already verified"
      );

    const verifiedUser = await this.userRepository.updateUser(
      { verificationCode: hashedVerificationCode },
      {
        verificationCode: null,
        verified: true,
      }
    );

    return verifiedUser.verified;
  }
}

export default AuthService;
