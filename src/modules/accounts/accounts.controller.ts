import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../../guards';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { AccountEntity } from './entities';
import { PrismaExceptionEntity } from '../../filters/prisma-exception/entities';

@Controller('accounts')
@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ type: PrismaExceptionEntity })
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiCreatedResponse({ type: AccountEntity })
  @ApiBadRequestResponse()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return new AccountEntity(
      await this.accountsService.create(createAccountDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: AccountEntity, isArray: true })
  async findAll() {
    const accounts = await this.accountsService.findAll();
    return accounts.map((account) => new AccountEntity(account));
  }

  @Get(':id')
  @ApiOkResponse({ type: AccountEntity })
  @ApiNotFoundResponse({ type: PrismaExceptionEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new AccountEntity(await this.accountsService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: AccountEntity })
  @ApiNotFoundResponse({ type: PrismaExceptionEntity })
  @ApiBadRequestResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return new AccountEntity(
      await this.accountsService.update(id, updateAccountDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: AccountEntity })
  @ApiNotFoundResponse({ type: PrismaExceptionEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new AccountEntity(await this.accountsService.remove(id));
  }
}
