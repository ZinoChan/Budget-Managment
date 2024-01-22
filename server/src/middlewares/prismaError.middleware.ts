import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "@/constants";
import { Prisma } from "@prisma/client";

const prismaErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025" && error.meta?.modelName) {
      const modelName = error.meta.modelName;
      res.status(HttpStatusCodes.NOT_FOUND).json({
        status: "fail",
        message: `The ${modelName} was not found.`,
      });
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      message:
        "Failed to process the request due to a database issue. Please try again later.",
    });

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "fail",
    message:
      "Failed to process the request due to a database issue. Please try again later.",
  });
  next(error);
};

export default prismaErrorMiddleware;
