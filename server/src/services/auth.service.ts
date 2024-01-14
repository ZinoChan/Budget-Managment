import { ORIGIN } from "@/config";
import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import UserRepository from "@/repositories/userRepository";
import { CreateUserInput, VerifyUserInput } from "@/schemas/user.schema";
import Mailer from "@/utils/mailer";
import generateSecureCode from "@/utils/verificationCode";
import { User } from "@prisma/client";
import argon2 from "argon2";
class AuthService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  public async createUser(userData: CreateUserInput): Promise<User> {
    const { username, email, password, passwordConfirmation } = userData;

    const hashPassword = await argon2.hash(password);

    const { verificationCode, verifyCode } = generateSecureCode();
    const user = await this.userRepository.createUser({
      username,
      email,
      password: hashPassword,
      verificationCode,
    });
    const redirectUrl = `${ORIGIN}/verifyemail/${verifyCode}`;
    await new Mailer(user, redirectUrl).sendVerificationCode();
    console.log(user);
    return user;
  }

  public async verifyUserHandler(id: string, verificationCode: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user)
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "user not found");

    if (user.verified) return true;

    if (user.verificationCode === verificationCode) {
      await this.userRepository.updateUser(id, {
        verificationCode,
      });
      return true;
    }

    return false;
  }
}

export default AuthService;
