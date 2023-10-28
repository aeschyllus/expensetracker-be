import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const { hashSync } = bcrypt;

const user = {
  id: 1,
  username: 'mlapada',
  email: 'mlapada@mail.com',
  password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
  createdAt: new Date('2023-10-20T11:18:56.411Z'),
  updatedAt: new Date('2023-10-20T11:18:56.411Z'),
};
const sampleToken = { accessToken: 'sample.token' };
const registerResult = {
  ...sampleToken,
  user,
};

const db = {
  user: {
    findUniqueOrThrow: jest.fn().mockResolvedValue(user),
  },
};

const jwt = {
  sign: jest.fn().mockReturnValue(sampleToken.accessToken),
};

const userServiceFunctions = {
  create: jest.fn().mockResolvedValue(user),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: db },
        { provide: JwtService, useValue: jwt },
        { provide: UsersService, useValue: userServiceFunctions },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should generate access token', async () => {
      await expect(
        service.login({ username: 'mlapada', password: 'mlapada' }),
      ).resolves.toEqual(sampleToken);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.login({ username: 'mlapada', password: 'invalidpassword' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw UnauthorizedException', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      await expect(
        service.login({ username: 'mlapada', password: 'invalidpassword' }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const result = service.register({
        username: 'mlapada',
        email: 'mlapada@mail.com',
        password: 'mlapada',
      });
      await expect(result).resolves.toEqual(registerResult);
    });

    it('should throw ConflictException for duplicate username/email', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new ConflictException());

      const result = service.register({
        username: 'mlapada', // duplicate username
        email: 'mlapada@mail.com',
        password: 'mlapada',
      });

      await expect(result).rejects.toThrowError(ConflictException);
    });
  });
});
