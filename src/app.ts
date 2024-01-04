import "module-alias/register";
import express from "express";
import { NODE_ENV, PORT } from "./appConfig";
import errorMiddleware from "./middlewares/error.midleware";
import { Route } from "./types/routes.interface";
import { API_ROUTES } from "./constants";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = PORT || 4001;
    this.env = NODE_ENV || "development";

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
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
