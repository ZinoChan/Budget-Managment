import redisClient from "@/lib/RedisClient";
import { CreateUserInterface } from "@/types/auth.interface";
import { signJwt } from "@/utils/jwt";
import { Prisma, PrismaClient, User } from "@prisma/client";
import config from "config";

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createUser = async (userData: CreateUserInterface): Promise<User> => {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  };

  findUniqueUser = async (
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect
  ) => {
    return (await this.prisma.user.findUnique({
      where,
      select,
    })) as User;
  };
  updateUser = async (
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect
  ) => {
    return (await this.prisma.user.update({ where, data, select })) as User;
  };

  signTokens = async (user: Prisma.UserCreateInput) => {
    // 1. Create Session
    redisClient.set(`${user.id}`, JSON.stringify(user), {
      EX: config.get<number>("redisCacheExpiresIn") * 60,
    });

    const access_token = signJwt({ sub: user.id }, "jwtAccessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    const refresh_token = signJwt(
      { sub: user.id },
      "jwtRefreshTokenPrivateKey",
      {
        expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
      }
    );

    return { access_token, refresh_token };
  };
}

export default UserRepository;
