import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
