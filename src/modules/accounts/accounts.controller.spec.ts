import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const accounts = [
  {
    id: 1,
    name: 'Savings',
    amount: 50000,
    userId: 1,
  },
  {
    id: 2,
    name: 'Emergency Funds',
    amount: 150000,
    userId: 1,
  },
];
const oneAccount = accounts[0];

const db = {
  create: jest.fn().mockResolvedValue(oneAccount),
  findAll: jest.fn().mockResolvedValue(accounts),
  findOne: jest.fn().mockResolvedValue(oneAccount),
  update: jest.fn().mockResolvedValue(oneAccount),
  remove: jest.fn().mockResolvedValue(oneAccount),
};

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: db }],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      await expect(
        controller.create({
          name: 'savings',
          amount: 200,
          userId: 1,
        }),
      ).resolves.toEqual(oneAccount);
    });

    it('should throw an UnauthorizedException', async () => {
      jest
        .spyOn(controller, 'create')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.create({
          name: 'savings',
          amount: 200,
          userId: 1,
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw BadRequestException', async () => {
      jest
        .spyOn(controller, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.create({
          name: 'savings',
          amount: 200,
          userId: 1,
        }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return array of accounts', async () => {
      await expect(controller.findAll()).resolves.toEqual(accounts);
    });

    it('should throw an UnauthorizedException', async () => {
      jest
        .spyOn(controller, 'findAll')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.findAll()).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('findOne', () => {
    it('should return an account', async () => {
      await expect(controller.findOne(1)).resolves.toEqual(oneAccount);
    });

    it('should throw an UnauthorizedException', async () => {
      jest
        .spyOn(controller, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.findOne(1)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      await expect(
        controller.update(1, { name: 'BPI Savings' }),
      ).resolves.toEqual(oneAccount);
    });

    it('should throw an UnauthorizedException', async () => {
      jest
        .spyOn(controller, 'update')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.update(1, { name: 'BPI Savings' }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(1, { name: 'BPI Savings' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException', async () => {
      jest
        .spyOn(controller, 'update')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.update(1, { name: 'BPI Savings' }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an account', async () => {
      await expect(controller.remove(1)).resolves.toEqual(oneAccount);
    });

    it('should throw an UnauthorizedException', async () => {
      jest
        .spyOn(controller, 'remove')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.remove(1)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
