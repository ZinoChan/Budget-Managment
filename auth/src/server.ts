import App from "./app";
import AuthController from "./controller/auth.controller";
import prisma from "./lib/PrismaClient";
import UserRepository from "./repositories/userRepository";
import AuthRoute from "./routes/auth.route";
import IndexRoute from "./routes/index.route";
import AuthService from "./services/auth.service";

const server = new App([
  new IndexRoute(),
  new AuthRoute(
    new AuthController(new AuthService(new UserRepository(prisma)))
  ),
]);

server.listen();
