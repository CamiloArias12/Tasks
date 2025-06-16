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
        host: process.env.COMMENT_SERVICE_HOST || 'localhost',
        port: Number(process.env.COMMENT_SERVICE_PORT) || 5003,
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
