import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import { omit } from "@/helpers";
import UserRepository, { excludedFields } from "@/repositories/userRepository";
import { verifyJwt } from "@/utils/jwt";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

class AuthMiddleware {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public validateResource =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (err: any) {
        if (err instanceof ZodError)
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            status: "fail",
            errors: err.errors,
          });
        next(err);
      }
    };

  public deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let access_token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        access_token = req.headers.authorization.split(" ")[1];
      else if (req.cookies.access_token)
        access_token = req.cookies.access_token;

      if (!access_token)
        return next(
          new HttpException(
            HttpStatusCodes.UNAUTHORIZED,
            "Your are not logged in"
          )
        );

      const decoded = verifyJwt<{ sub: string }>(
        access_token,
        "jwtAccessSecret"
      );

      if (!decoded)
        return next(
          new HttpException(
            HttpStatusCodes.UNAUTHORIZED,
            "Invalid token or user does not exist"
          )
        );

      const session = await this.userRepository.getUserSessionFromRedis(
        decoded.sub
      );

      if (!session)
        return next(
          new HttpException(
            HttpStatusCodes.UNAUTHORIZED,
            "Invalid token or session expired"
          )
        );

      const user = await this.userRepository.findUniqueUser({
        id: JSON.parse(session).id,
      });

      if (!user)
        return next(
          new HttpException(
            HttpStatusCodes.UNAUTHORIZED,
            "Invalid token or session has expired"
          )
        );

      res.locals.user = omit(user, excludedFields);

      next();
    } catch (error) {
      next(error);
    }
  };

  requireUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (!user) {
        return next(
          new HttpException(
            HttpStatusCodes.UNAUTHORIZED,
            "Session has expired or user doesn't exist"
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthMiddleware;
