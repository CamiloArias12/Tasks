import { MicroserviceAllExceptionsFilter } from '@libs/contracts/general/exceptions-filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TASK_SERVICE_HOST || 'localhost',
        port: Number(process.env.TASK_SERVICE_PORT) || 5001,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new MicroserviceAllExceptionsFilter());
  await app.listen();
}

bootstrap();
