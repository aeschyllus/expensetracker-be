import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../users/entities';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username: loginDto.username },
    });

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: this.jwtService.sign({ userId: user.id }) };
  }

  async register(registerDto: RegisterDto) {
    const user = new UserEntity(await this.usersService.create(registerDto));
    const token = this.jwtService.sign({ userId: user.id });

    return { accessToken: token, user };
  }
}
