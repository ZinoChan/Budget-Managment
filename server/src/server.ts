import App from "./app";
import AuthController from "./controller/auth.controller";
import prismaClient from "./lib/PrismaClient";
import UserRepository from "./repositories/userRepository";
import AuthRoute from "./routes/auth.route";
import IndexRoute from "./routes/index.route";
import AuthService from "./services/auth.service";
import Mailer from "./utils/mailer";

const server = new App([
  new IndexRoute(),
  new AuthRoute(
    new AuthController(
      new AuthService(new UserRepository(prismaClient), new Mailer())
    )
  ),
]);
server.listen();
