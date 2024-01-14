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

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
      },
    });
    return user;
  }
}

export default UserRepository;
