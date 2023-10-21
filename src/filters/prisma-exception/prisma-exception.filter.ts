import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type ErrorCodesStatus = {
  [key: string]: number;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private errorCodesStatus: ErrorCodesStatus = {
    P2002: HttpStatus.CONFLICT,
    P2003: HttpStatus.BAD_REQUEST,
    P2025: HttpStatus.NOT_FOUND,
  };

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const statusCode = this.errorCodesStatus[exception.code];
    const message = `[${exception.code}]: ${this.exceptionShortMessage(
      exception.message,
    )}`;

    // Default 500 error code
    if (!Object.keys(this.errorCodesStatus).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private exceptionShortMessage(message: string) {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
