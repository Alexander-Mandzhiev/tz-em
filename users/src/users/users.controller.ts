import { Controller, Body, Patch, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAll() {
    return this.usersService.getAll();
  }
  @Patch()
  async update(@Body() dto: UserDto) {
    return this.usersService.update(dto);
  }
}
