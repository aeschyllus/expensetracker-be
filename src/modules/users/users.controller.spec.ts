import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const usersArray = [
  {
    id: 1,
    username: 'mlapada',
    email: 'mlapada@mail.com',
    createdAt: '2023-10-20T11:18:56.411Z',
    updatedAt: '2023-10-20T11:18:56.411Z',
  },
];
const oneUser = usersArray[0];

const db = {
  create: jest.fn().mockReturnValue(oneUser),
  findAll: jest.fn().mockResolvedValue(usersArray),
  findOne: jest.fn().mockResolvedValue(oneUser),
  update: jest.fn().mockResolvedValue(oneUser),
  remove: jest.fn().mockResolvedValue(oneUser),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: db }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a user', async () => {
      await expect(
        controller.create({
          username: 'mlapada',
          email: 'mlapada@mail.com',
          password: 'mlapada',
        }),
      ).resolves.toEqual(oneUser);
    });

    it('should throw ConflictException for duplicate username/email', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());

      const result = controller.create({
        username: 'mlapada', // duplicate username
        email: 'mlapada@mail.com', // duplicate email
        password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
      });

      await expect(result).rejects.toThrowError(ConflictException);
    });

    it('should throw BadRequestException for invalid inputs', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      const result = controller.create({
        username: '', // empty username
        email: 'mlapada@mail.com',
        password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await controller.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('findOne', () => {
    it('should find one user', () => {
      expect(controller.findOne(1)).resolves.toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      const result = controller.findOne(2); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = await controller.update(1, { username: 'mlapada' });
      expect(user).toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      const result = controller.update(2, { username: 'mlapada' }); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException for duplicate username/email', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new ConflictException());

      const result = controller.update(1, { username: 'mlapada' }); // duplicate username

      await expect(result).rejects.toThrowError(ConflictException);
    });

    it('should throw BadRequestException for invalid inputs', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadRequestException());

      const result = controller.update(1, {
        username: '', // empty username
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a user', () => {
      expect(controller.remove(1)).resolves.toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      const result = service.remove(2); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });
});
