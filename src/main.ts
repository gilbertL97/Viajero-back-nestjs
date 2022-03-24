import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  }); /*, { cors: true })*/
  const port: number = parseInt(process.env.PORT);
  app.setGlobalPrefix('viajero');
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
