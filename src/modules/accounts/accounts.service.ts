import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  create(createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({ data: createAccountDto });
  }

  findAll() {
    return this.prisma.account.findMany();
  }

  findOne(id: number) {
    return this.prisma.account.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  remove(id: number) {
    return this.prisma.account.delete({ where: { id } });
  }
}
