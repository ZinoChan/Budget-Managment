import { HttpStatusCodes } from "@/constants";
import { CreateUserInput } from "@/schemas/user.schema";
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
      const user = await this.authService.createUser(body);
      return res
        .status(HttpStatusCodes.CREATED)
        .send({ message: "user created successfully" });
    } catch (error: any) {
      next(error);
    }
  };
}

export default AuthController;
