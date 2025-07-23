import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const frontendPath = join(__dirname, '../frontend');
  app.useStaticAssets(frontendPath);
  app.use(express.static(frontendPath));


  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });

  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();

