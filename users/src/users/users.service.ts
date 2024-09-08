import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) { }

  async getAll() {
    try {
      return await this.prisma.users.findMany()
    } catch (error) {
      throw new HttpException(`Произошла ошибка получения задач! ${error}`, HttpStatus.FORBIDDEN)
    }
  }

  async update(dto: UserDto) {
    try {
      const count = await this.prisma.users.count({ where: { problems: true } })
      await this.prisma.users.updateMany({ where: { problems: true }, data: { problems: false } })
      return count;
    }
    catch (error) {
      throw new HttpException(`Произошла ошибка обновления порядка задачи!`, HttpStatus.FORBIDDEN);
    }
  }
}