import express from "express";
import { NODE_ENV, PORT } from "./config";
import errorMiddleware from "./middlewares/error.midleware";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = PORT || 4001;
    this.env = NODE_ENV || "development";

    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
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
