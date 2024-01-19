import { CreateUserInterface } from "@/types/auth.interface";
import { signJwt } from "@/utils/jwt";
import { Prisma, PrismaClient, User } from "@prisma/client";
import config from "config";
import { RedisClientType } from "redis";

export const excludedFields = [
  "password",
  "verified",
  "verificationCode",
  "passwordResetAt",
  "passwordResetToken",
];

class UserRepository {
  private prisma: PrismaClient;
  private redis: RedisClientType;

  constructor(prisma: PrismaClient, redis: RedisClientType) {
    this.prisma = prisma;
    this.redis = redis;
  }

  createUser = async (userData: CreateUserInterface): Promise<User> => {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  };

  findUser = async (
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect
  ) => {
    return (await this.prisma.user.findFirst({
      where,
      select,
    })) as User;
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
    this.redis.set(`${user.id}`, JSON.stringify(user), {
      EX: config.get<number>("redisCacheExpiresIn") * 60,
    });

    const access_token = signJwt({ sub: user.id }, "jwtAccessSecret", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, "jwtRefreshSecret", {
      expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
    });

    return { access_token, refresh_token };
  };

  getUserSessionFromRedis = async (session: string) => {
    return this.redis.get(session);
  };

  delUserSessionFromRedis = async (userId: string) => {
    return this.redis.del(userId);
  };
}

export default UserRepository;
