import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger()

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by', 'X-Powered-By');

  await app.listen(process.env.API_PORT)
  logger.log(`server starting ${process.env.API_PORT}`)
}
bootstrap();
