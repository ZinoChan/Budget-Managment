// import "module-alias/register";
require("dotenv").config();
import express from "express";
import config from "config";
import errorMiddleware from "./middlewares/error.midleware";
import { Route } from "./types/routes.interface";
import { API_ROUTES } from "./constants";
import morgan from "morgan";
import validateEnv from "./utils/validateEnv";
import cookieParser from "cookie-parser";
import cors from "cors";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.initializeEnv();

    this.app = express();
    this.port = config.get<number>("port") || 4001;
    this.env = config.get<string>("nodeEnv") || "development";

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeEnv() {
    validateEnv();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    if (this.env === "development") this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [config.get<string>("origin")],
        credentials: true,
      })
    );
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => this.app.use(API_ROUTES.BASE_URL, route.router));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }
}

export default App;
