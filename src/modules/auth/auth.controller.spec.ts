import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const user = {
  id: 1,
  username: 'mlapada',
  email: 'mlapada@mail.com',
  createdAt: new Date('2023-10-20T11:18:56.411Z'),
  updatedAt: new Date('2023-10-20T11:18:56.411Z'),
};
const sampleToken = { accessToken: 'sample.token' };
const registerResult = {
  ...sampleToken,
  user,
};

const funcs = {
  login: jest.fn().mockResolvedValue(sampleToken),
  register: jest.fn().mockResolvedValue(registerResult),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: funcs }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should generate access token', async () => {
      await expect(
        controller.login({ username: 'mlapada', password: 'mlapada' }),
      ).resolves.toEqual(sampleToken);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(service, 'login').mockRejectedValue(new NotFoundException());

      const result = controller.login({
        username: 'randomuser',
        password: 'mlapada',
      });

      await expect(result).rejects.toThrowError(NotFoundException);
    });

    it('should throw UnauthorizedException', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException());

      const result = controller.login({
        username: 'mlapada',
        password: 'invalid',
      });

      await expect(result).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw BadRequestException', async () => {
      jest.spyOn(service, 'login').mockRejectedValue(new BadRequestException());

      const result = controller.login({
        username: 'mlapada',
        password: 'invalid',
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });

  describe('register', () => {
    it('should generate access token', async () => {
      const result = controller.register({
        username: 'mlapada',
        email: 'mlapada@mail.com',
        password: 'mlapada',
      });

      await expect(result).resolves.toEqual(registerResult);
    });

    it('should throw ConflictException', async () => {
      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new ConflictException());

      const result = controller.register({
        username: 'mlapada', // duplicate username
        email: 'mlapada@mail.com',
        password: 'mlapada',
      });

      await expect(result).rejects.toThrowError(ConflictException);
    });

    it('should throw BadRequestException', async () => {
      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new BadRequestException());

      const result = controller.register({
        username: '', // empty username
        email: 'mlapada@mail.com',
        password: 'mlapada',
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });
});
