import { API_ROUTES, HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import redisClient from "@/lib/RedisClient";
import UserRepository from "@/repositories/userRepository";
import { CreateUserInput } from "@/schemas/user.schema";
import { signJwt, verifyJwt } from "@/utils/jwt";
import Mailer from "@/utils/mailer";
import {
  generateSecureCode,
  hashVerificationCode,
} from "@/utils/verificationCode";
import argon2 from "argon2";
import config from "config";

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

    const redirectUrl = `${config.get<string>("origin")}/${API_ROUTES.AUTH}/${
      API_ROUTES.VERIFY_EMAIL
    }/${verifyCode}`;
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

  public async loginUser(email: string, password: string) {
    const user = await this.userRepository.findUniqueUser(
      { email },
      {
        id: true,
        email: true,
        verified: true,
        password: true,
      }
    );

    if (!user || !(await argon2.verify(user.password!, password)))
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        "Invalid email or password"
      );

    const { access_token, refresh_token } =
      await this.userRepository.signTokens(user);

    return { access_token, refresh_token };
  }

  public async refreshAccessToken(refresh_token: string) {
    const errMsg = "could not refresh access token";
    if (!refresh_token)
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "no refresh" + errMsg);

    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "jwtRefreshTokenPrivateKey"
    );
    if (!decoded)
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        "not decoded" + errMsg
      );

    const session = await redisClient.get(decoded.sub);
    if (!session)
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "no session" + errMsg);

    const user = await this.userRepository.findUniqueUser({
      id: JSON.parse(session).id,
    });

    if (!user)
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "no user" + errMsg);

    const access_token = signJwt({ sub: user.id }, "jwtAccessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    return { access_token };
  }
}

export default AuthService;
