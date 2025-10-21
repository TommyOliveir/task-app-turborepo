import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prismaService/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/services/googleStrategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TasksModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available app-wide to make .env works
    }),
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}
