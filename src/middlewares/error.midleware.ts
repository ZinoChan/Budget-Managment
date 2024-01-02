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
    const message = error.message || "internal server error occurred";
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
}

export default errorMiddleware;
