import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "@/constants";

class AppMiddleware {
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
}

export default AppMiddleware;
