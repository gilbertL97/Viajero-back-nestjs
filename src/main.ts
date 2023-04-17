import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setDefaultUser from './script/default-user';

/*const corsConfig: CorsOptions = {
  origin: 'http://localhost:3000', //http://localhost:3000/
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  /* credentials: true 
  origin: ['http://localhost:3001'],
  credentials: true,
};*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const port: number = parseInt(process.env.PORT);
  app.setGlobalPrefix('viajero');
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port || 3000);
  //app.enableCors();
}
bootstrap();
