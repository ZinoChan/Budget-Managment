import UserRepository from "@/repositories/userRepository";
import { CreateUserInput } from "@/schemas/user.schema";
import { User } from "@prisma/client";
import argon2 from "argon2";
class AuthService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  public async createUser(userData: CreateUserInput): Promise<User> {
    const { username, email, password } = userData;

    const hashPassword = await argon2.hash(password);

    const user = await this.userRepository.createUser({
      username,
      email,
      password: hashPassword,
    });

    return user;
  }
}

export default AuthService;
