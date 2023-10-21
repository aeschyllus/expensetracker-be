import { Test, TestingModule } from '@nestjs/testing';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: db }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a user', () => {
      expect(
        controller.create({
          username: 'mlapada',
          email: 'mlapada@mail.com',
          password: 'mlapada',
        }),
      ).resolves.toEqual(oneUser);
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
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = await controller.update(1, { username: 'mlapada' });
      expect(user).toEqual(oneUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', () => {
      expect(controller.remove(1)).resolves.toEqual(oneUser);
    });
  });
});
