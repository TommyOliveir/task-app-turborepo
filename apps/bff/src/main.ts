import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COMMON } from './constants/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const CORS_OPTION = {
    origin: configService.get<string>('BASE_UI_URL')!,
    credentials: true,
  };

  // allow Next.js frontend to connect to nest bckend - due to cross origin issue
  app.enableCors(CORS_OPTION);

  // make global pipe works such as 'empty task - POST REQUEST' will response bad request and prohibit additional properties anf value
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? COMMON.PORT);
  logger.log(`Application listening to port ${COMMON.PORT}`);
}
bootstrap();
