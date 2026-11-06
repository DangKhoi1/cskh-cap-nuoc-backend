import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    bodyParser: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          EC: 0,
          EM: 'Invalid request data',
          errors: errors.flatMap((error) =>
            Object.values(error.constraints || {}),
          ),
        }),
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
await bootstrap();
