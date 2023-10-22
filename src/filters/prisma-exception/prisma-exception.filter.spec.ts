import { HttpStatus } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-exception.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const mockStatus = jest.fn().mockImplementation(() => ({
  json: jest.fn(),
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaExceptionFilter],
    }).compile();

    filter = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
  });

  it('should be defined', () => {
    expect(new PrismaExceptionFilter()).toBeDefined();
  });

  it('should handle conflict exception', () => {
    filter.catch(
      new PrismaClientKnownRequestError('sample error message', {
        code: 'P2002',
        clientVersion: '5.4.2',
        meta: undefined,
      }),
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledWith(HttpStatus.CONFLICT);
  });

  it('should handle bad request exception', () => {
    filter.catch(
      new PrismaClientKnownRequestError('sample error message', {
        code: 'P2003',
        clientVersion: '5.4.2',
        meta: undefined,
      }),
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('should handle not found exception', () => {
    filter.catch(
      new PrismaClientKnownRequestError('sample error message', {
        code: 'P2025',
        clientVersion: '5.4.2',
        meta: undefined,
      }),
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should respond with error code 500 for unhandled prisma errors', () => {
    filter.catch(
      new PrismaClientKnownRequestError('sample error message', {
        code: 'P2026', // unhandled prisma error code
        clientVersion: '5.4.2',
        meta: undefined,
      }),
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
