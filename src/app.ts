import express from "express";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4001;
    this.env = "development";

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
