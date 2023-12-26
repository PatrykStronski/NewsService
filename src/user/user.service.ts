import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { genSalt, hash, compare } from 'bcrypt';
import { AuthBodyDto } from "src/auth/auth.dto";
import { UserInput, UserRoleEdit, UserStatusEdit } from "./user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { User, UserStatus } from "@prisma/client";
import { IPayload } from "src/token/token.model";

const MAX_PAGE_SIZE = 10;
const USER_FIELDS_DISPLAY = {
  id: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  salt: false,
  password: false
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async user(
    id: number,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      select: USER_FIELDS_DISPLAY,
      where: {
        id
      },
    });
  }

  async users(cursor = 1, take = MAX_PAGE_SIZE): Promise<User[]> {
    return this.prisma.user.findMany({
      select: USER_FIELDS_DISPLAY,
      cursor: { id: cursor },
      take
    });
  }

  async createUser(data: UserInput): Promise<User> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    });
    if (existing) throw new BadRequestException(`User already exists with ${data.email} or phone ${data.phone}`);
    try {
      const salt = await genSalt(8);
      data.password = await hash(data.password, salt)
      data.salt = salt;
      return await this.prisma.user.create({
        data: data as User,
      });
    } catch (e) {
      console.error(e)
      throw new BadRequestException('Cannot create user');
    }
  }

  async authorizeUser(authData: AuthBodyDto): Promise<IPayload> {
    const userData = await this.prisma.user.findUnique({
      where: {
        email: authData.email
      }
    });
    if (!userData) {
      throw new UnauthorizedException({ message: 'Wrong user or password' })
    }
    if (userData.status === UserStatus.blocked) {
      throw new ForbiddenException('The user has been blocked! Contact administrator');
    }
    const res = await compare(authData.password, userData.password);
    if (res) return {
      id: userData.id,
      email: userData.email,
      role: userData.role
    }
    else throw new UnauthorizedException({ message: 'Wrong user or password' });
  }

  async getUserByMail(email: string): Promise<IPayload> {
    const userData = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!userData) {
      throw new UnauthorizedException({ message: 'Wrong user or password' })
    }
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role
    }
  }

  async changeUserRole(body: UserRoleEdit) {
    try {
      return await this.prisma.user.update({
        select: USER_FIELDS_DISPLAY,
        where: {
          email: body.email
        },
        data: {
          role: body.role
        }
      })
    } catch (e) {
      if (e.code === 'P2025') throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      throw e;
    }
  }

  async changeUserStatus(body: UserStatusEdit) {
    try {
      return await this.prisma.user.update({
        select: USER_FIELDS_DISPLAY,
        where: {
          email: body.email
        },
        data: {
          status: body.status
        }
      })
    } catch (e) {
      if (e.code === 'P2025') throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      throw e;
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({
        select: USER_FIELDS_DISPLAY,
        where: { id }
      })
    } catch (e) {
      if (e.code === 'P2025') throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      throw e;
    }
  }

  async createAdmin(admin: UserInput) {
    const salt = await genSalt(8);
    admin.password = await hash(admin.password, salt)
    admin.salt = salt;
    await this.prisma.user.upsert({
      where: {
        email: admin.email
      },
      create: admin as User,
      update: admin
    })
  }
}
