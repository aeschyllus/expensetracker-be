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
    createdAt: '2023-10-20T11:18:56.411Z',
    updatedAt: '2023-10-20T11:18:56.411Z',
  },
];
const oneUser = usersArray[0];

const db = {
  user: {
    create: jest.fn().mockReturnValue(oneUser),
    findMany: jest.fn().mockResolvedValue(usersArray),
    findUniqueOrThrow: jest.fn().mockResolvedValue(oneUser),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: db }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a user', () => {
      expect(
        service.create({
          username: 'mlapada',
          email: 'mlapada@mail.com',
          password: hashSync('mlapada', Number(process.env.HASH_ROUNDS)),
        }),
      ).resolves.toEqual(oneUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('findOne', () => {
    it('should find one user', () => {
      expect(service.findOne(1)).resolves.toEqual(oneUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = await service.update(1, { username: 'mlapada' });
      expect(user).toEqual(oneUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', () => {
      expect(service.remove(1)).resolves.toEqual(oneUser);
    });
  });
});
