import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); 


  app.enableCors({
    origin: "http://192.168.1.8:3000",
    credentials: true
  });

  await app.listen(5000);
}
bootstrap();
