import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
