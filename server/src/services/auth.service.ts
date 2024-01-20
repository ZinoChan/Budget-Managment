import { API_ROUTES, HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
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
import crypto from "crypto";

class AuthService {
  private userRepository: UserRepository;
  private mailer: Mailer;

  constructor(userRepository: UserRepository, mailer: Mailer) {
    this.userRepository = userRepository;
    this.mailer = mailer;
  }

  private async sendVerificationEmail(email: string) {
    const { verificationCode, verifyCode } = generateSecureCode();
    const user = await this.userRepository.updateUser(
      { email },
      { verificationCode },
      { username: true, email: true }
    );
    const redirectUrl = `${config.get<string>("origin")}/${API_ROUTES.AUTH}/${
      API_ROUTES.VERIFY_EMAIL
    }/${verifyCode}`;
    await this.mailer.sendVerificationCode(
      redirectUrl,
      user.username,
      user.email
    );
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

    const user = await this.userRepository.createUser({
      username,
      email,
      password: hashPassword,
    });

    await this.sendVerificationEmail(user.email);
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

    if (!user.verified) {
      this.sendVerificationEmail(user.email);
      throw new HttpException(
        HttpStatusCodes.UNAUTHORIZED,
        `You are not verified, please verify your email, link sent to ${email}`
      );
    }

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
      throw new HttpException(HttpStatusCodes.FORBIDDEN, errMsg);

    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "jwtRefreshSecret"
    );
    if (!decoded) throw new HttpException(HttpStatusCodes.FORBIDDEN, errMsg);

    const session = await this.userRepository.getUserSessionFromRedis(
      decoded.sub
    );
    if (!session) throw new HttpException(HttpStatusCodes.FORBIDDEN, errMsg);

    const user = await this.userRepository.findUniqueUser({
      id: JSON.parse(session).id,
    });

    if (!user) throw new HttpException(HttpStatusCodes.FORBIDDEN, errMsg);

    const access_token = signJwt({ sub: user.id }, "jwtAccessSecret", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    return access_token;
  }

  public async logOutUser(userId: string) {
    await this.userRepository.delUserSessionFromRedis(userId);
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.findUniqueUser({ email });

    if (!user)
      throw new HttpException(
        HttpStatusCodes.NOT_FOUND,
        "No user with that email"
      );

    if (!user.verified)
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        "Accont not verifiied"
      );

    if (user.provider)
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        "your account is registered from a provider try login using login providers"
      );

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await this.userRepository.updateUser(
      { id: user.id },
      {
        passwordResetToken,
        passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { email: true }
    );

    const url = `${config.get<string>("origin")}/${
      API_ROUTES.RESET_PASSWORD
    }/${resetToken}`;
    await this.mailer.sendPasswordResetToken(url, user.username, user.email);

    return user.email;
  }

  public async resetPassword(
    resetToken: string,
    password: string,
    passwordConfirmation: string
  ) {
    if (password !== passwordConfirmation) {
      throw new HttpException(
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        "Password and password confirmation do not match"
      );
    }
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await this.userRepository.findUser({
      passwordResetToken,
      passwordResetAt: {
        gt: new Date(),
      },
    });

    if (!user)
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        "Invalid token or token has exprired"
      );

    const hashedPassword = await argon2.hash(password);
    await this.userRepository.updateUser(
      { id: user.id },
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetAt: null,
      }
    );
  }
}

export default AuthService;
