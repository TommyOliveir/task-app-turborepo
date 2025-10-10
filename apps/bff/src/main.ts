import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = 3000;
  const app = await NestFactory.create(AppModule);

  // allow Next.js frontend to connect to nest bckend - due to cross origin issue
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // make global pipe works such as 'empty task - POST REQUEST' will response bad request and prohibit additional properties anf value
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? port);
  logger.log(`Application listening to port ${port}`);
}
bootstrap();
