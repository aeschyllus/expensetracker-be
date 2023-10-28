import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthEntity, RegisterEntity } from './entities';
import { RegisterDto } from './dto/register.dto';
import { PrismaExceptionEntity } from '../../filters/prisma-exception/entities';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  @ApiNotFoundResponse({ type: PrismaExceptionEntity })
  @ApiUnauthorizedResponse({ type: PrismaExceptionEntity })
  @ApiBadRequestResponse()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiCreatedResponse({ type: RegisterEntity })
  @ApiConflictResponse({ type: PrismaExceptionEntity })
  @ApiBadRequestResponse()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
