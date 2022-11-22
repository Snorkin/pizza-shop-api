import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  const swagger = new DocumentBuilder()
    .setTitle('Pizza shop API')
    .setDescription('Документация по PS API')
    .setVersion('0.1')
    .addTag('Snorki')
    .build();
  const docs = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/api/docs', app, docs);
  app.enableCors();
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
