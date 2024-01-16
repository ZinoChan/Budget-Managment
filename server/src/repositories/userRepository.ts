import { CreateUserInterface } from "@/types/auth.interface";
import { Prisma, PrismaClient, User } from "@prisma/client";

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(userData: CreateUserInterface): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }

  async findUniqueUser(where: Prisma.UserWhereUniqueInput) {
    return (await this.prisma.user.findUnique({ where })) as User;
  }
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect
  ) {
    return (await this.prisma.user.update({ where, data, select })) as User;
  }
}

export default UserRepository;
