import { HttpStatusCodes } from "@/constants";
import { CreateUserInput, VerifyUserInput } from "@/schemas/user.schema";
import AuthService from "@/services/auth.service";
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
}

export default AuthController;
