import { CreateUserInterface } from "@/types/auth.interface";
import { PrismaClient, User } from "@prisma/client";

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
}

export default UserRepository;
