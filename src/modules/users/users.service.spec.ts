import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const usersArray = [
  {
    id: 1,
    username: 'mlapada',
    email: 'mlapada@mail.com',
    password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
    createdAt: new Date('2023-10-20T11:18:56.411Z'),
    updatedAt: new Date('2023-10-20T11:18:56.411Z'),
  },
];
const oneUser = usersArray[0];

const db = {
  user: {
    create: jest.fn().mockResolvedValue(oneUser),
    findMany: jest.fn().mockResolvedValue(usersArray),
    findUniqueOrThrow: jest.fn().mockResolvedValue(oneUser),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: db }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a user', async () => {
      const result = service.create({
        username: 'mlapada',
        email: 'mlapada@mail.com',
        password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
      });

      await expect(result).resolves.toEqual(oneUser);
    });

    it('should throw ConflictException for duplicate username/email', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(new ConflictException());

      const result = service.create({
        username: 'mlapada', // duplicate username
        email: 'mlapada@mail.com', // duplicate email
        password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
      });

      await expect(result).rejects.toThrowError(ConflictException);
    });

    // TODO: Document in Swagger
    it('should throw BadRequestException for invalid inputs', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(new BadRequestException());

      const result = service.create({
        username: '', // empty username
        email: 'mlapada@mail.com',
        password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      await expect(service.findOne(1)).resolves.toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue(new NotFoundException());

      const result = service.findOne(2); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = await service.update(1, { username: 'mlapada' });
      expect(user).toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(new NotFoundException());

      const result = service.update(2, { username: 'mlapada' }); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException for duplicate username/email', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(new ConflictException());

      const result = service.update(1, { username: 'mlapada' }); // duplicate username

      await expect(result).rejects.toThrowError(ConflictException);
    });

    // TODO: Document in Swagger
    it('should throw BadRequestException for invalid inputs', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(new BadRequestException());

      const result = service.update(1, {
        username: '', // empty username
      });

      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a user', () => {
      expect(service.remove(1)).resolves.toEqual(oneUser);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest
        .spyOn(prisma.user, 'delete')
        .mockRejectedValue(new NotFoundException());

      const result = service.remove(2); // non-existing ID

      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });
});
