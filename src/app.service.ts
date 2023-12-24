import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { UserService } from './user/user.service';

const ADMIN_DATA = {
  email: 'admin@admin.admin',
  phone: '+99812312312',
  password: 'admin',
  role: UserRole.admin,
  status: UserStatus.active,
}

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private us: UserService) { }

  async onApplicationBootstrap() {
    if (!process.env.INSERT_ADMIN) return;
    await this.us.createAdmin(ADMIN_DATA);
  }
}
