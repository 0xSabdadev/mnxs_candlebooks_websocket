import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Manexus API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
