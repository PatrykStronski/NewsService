import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { genSalt, hash, compare } from 'bcrypt';
import { AuthBodyDto } from "src/auth/auth.dto";
import { UserInput } from "./user.dto";
import { PrismaService } from "src/prisma.service";

const MAX_PAGE_SIZE = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    id: number,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id
      },
    });
  }

  async users(cursor = 0, take = MAX_PAGE_SIZE): Promise<User[]> {
    return this.prisma.user.findMany({
      cursor: {id: cursor},
      take
    });
  }

  async createUser(data: UserInput): Promise<User> {
    try {
      const salt = await genSalt(8);
      data.password = await hash(data.password, salt)
      data.salt = salt;
      return this.prisma.user.create({
        data,
      });
    } catch (e) {
      console.error(e)
      throw new BadRequestException('Cannot create user');
    }
  }

  async authorizeUser(authData: AuthBodyDto): Promise<IToken> {
    const userData = await this.prisma.user.findUnique({
      where: {
        email: authData.email
      }
    });
    if (!userData) {
      throw new UnauthorizedException({message: 'Wrong user or password'})
    }
    const res = await compare(authData.password, userData.password);
    if (res) return {
      userId: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    }
    else throw new UnauthorizedException({message: 'Wrong user or password'});
  }
}
