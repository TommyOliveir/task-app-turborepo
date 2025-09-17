import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // allow Next.js frontend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? port);
  logger.log(`Application listening to port ${port}`);
}
bootstrap();
