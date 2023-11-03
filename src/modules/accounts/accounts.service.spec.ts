import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma/prisma.service';

const accounts = [
  {
    id: 1,
    name: 'Savings',
    amount: 50000,
    userId: 1,
    createdAt: new Date('2023-10-20T11:18:56.411Z'),
    updatedAt: new Date('2023-10-20T11:18:56.411Z'),
  },
  {
    id: 2,
    name: 'Emergency Funds',
    amount: 150000,
    userId: 1,
    createdAt: new Date('2023-10-20T11:18:56.411Z'),
    updatedAt: new Date('2023-10-20T11:18:56.411Z'),
  },
];
const oneAccount = accounts[0];

const db = {
  account: {
    create: jest.fn().mockResolvedValue(oneAccount),
    findMany: jest.fn().mockResolvedValue(accounts),
    findUniqueOrThrow: jest.fn().mockResolvedValue(oneAccount),
    update: jest.fn().mockResolvedValue(oneAccount),
    delete: jest.fn().mockResolvedValue(oneAccount),
  },
};

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService, { provide: PrismaService, useValue: db }],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      await expect(
        service.create({ name: 'Luho', amount: 420.69, userId: 1 }),
      ).resolves.toEqual(oneAccount);
    });
  });

  describe('findAll', () => {
    it('should return and array of accounts', async () => {
      await expect(service.findAll()).resolves.toEqual(accounts);
    });
  });

  describe('findOne', () => {
    it('should find one account', async () => {
      await expect(service.findOne(1)).resolves.toEqual(oneAccount);
    });

    it('shoud throw NotFoundException', async () => {
      jest
        .spyOn(prisma.account, 'findUniqueOrThrow')
        .mockRejectedValue(new NotFoundException());

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update account', async () => {
      const result = service.update(1, { name: 'BPI Savings' });
      await expect(result).resolves.toEqual(oneAccount);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prisma.account, 'update')
        .mockRejectedValue(new NotFoundException());

      const result = service.update(1, { name: 'BPI Savings' });

      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      await expect(service.remove(1)).resolves.toEqual(oneAccount);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prisma.account, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(service.remove(1)).rejects.toThrowError(NotFoundException);
    });
  });
});
