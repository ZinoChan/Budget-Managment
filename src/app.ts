import express from "express";
import { NODE_ENV, PORT } from "./config";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = PORT || 4001;
    this.env = NODE_ENV || "development";

    this.initializeMiddlewares();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }
}

export default App;
