import { MicroserviceAllExceptionsFilter } from '@libs/contracts/general/exceptions-filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new MicroserviceAllExceptionsFilter());
  
  const port = Number(process.env.EXTERNAL_SERVICE_PORT) || 5004;
  await app.listen(port);
}

bootstrap();
