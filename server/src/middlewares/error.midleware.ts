import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import { Request, Response, NextFunction } from "express";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal server error occurred";
    res.status(status).json({ status: "fail", message });
  } catch (error) {
    next(error);
  }
}

export default errorMiddleware;
