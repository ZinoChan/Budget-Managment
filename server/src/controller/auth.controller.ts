import { HttpStatusCodes } from "@/constants";
import {
  CreateUserInput,
  LoginUserInput,
  VerifyUserInput,
} from "@/schemas/user.schema";
import AuthService from "@/services/auth.service";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/utils/cookies";
import { Request, Response, NextFunction } from "express";

class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public signUp = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    const body = req.body;

    try {
      const userEmail = await this.authService.createUser(body);
      return res.status(HttpStatusCodes.CREATED).send({
        message: `An email verification has been sent to ${userEmail}`,
      });
    } catch (error: any) {
      console.log(`Error SignUp: ${error}`);
      next(error);
    }
  };

  public verifyEmail = async (
    req: Request<VerifyUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const verifiedUser = await this.authService.verifyUserEmail(
        req.params.verificationCode
      );
      if (verifiedUser)
        return res
          .status(HttpStatusCodes.OK)
          .send({ message: "User email successfully verified" });
    } catch (error) {
      console.log("Email Verification Error", error);
      next(error);
    }
  };

  public login = async (
    req: Request<LoginUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const { access_token, refresh_token } = await this.authService.loginUser(
        email,
        password
      );

      res.cookie("access_token", access_token, accessTokenCookieOptions);
      res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
      res.cookie("logged_in", true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        access_token,
      });
    } catch (error) {
      console.log("login Error", error);
      next(error);
    }
  };

  public refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      const access_token = await this.authService.refreshAccessToken(
        refresh_token
      );

      res.cookie("access_token", access_token, accessTokenCookieOptions);
      res.cookie("logged_in", true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        access_token,
      });
    } catch (error) {
      console.log("login Error", error);
      next(error);
    }
  };
  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logOutUser(res.locals.user.id);

      res.cookie("access_token", "", { maxAge: -1 });
      res.cookie("refresh_token", "", { maxAge: -1 });
      res.cookie("logged_in", "", { maxAge: -1 });

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "You have been successfully logged out",
      });
    } catch (error) {
      console.log("Logout Err: ", error);
      next(error);
    }
  };
}

export default AuthController;
