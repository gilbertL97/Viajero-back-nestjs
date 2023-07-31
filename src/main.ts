import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ContractorModule } from './contractor/contractor.module';
import { CountryModule } from './country/country.module';
import { CoverageModule } from './coverage/coverage.module';
import { FileModule } from './file/file.module';
import setDefaultUser from './script/default-user';
import { TravelerModule } from './traveler/traveler.module';

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
  app.setGlobalPrefix('viajero');
  const configSwagger = new DocumentBuilder()
    .setTitle('Viajeros Api')
    .setDescription('Documentacion y demo de la aplicacion Viajeros Online')
    .setVersion('v1')
    .addTag('Viajero')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // Este es el nombre del campo en Swagger UI donde ingresarás el token
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger, {
    ignoreGlobalPrefix: false,
    include: [
      AuthModule,
      ContractorModule,
      CountryModule,
      CoverageModule,
      FileModule,
      TravelerModule,
    ],
  });
  SwaggerModule.setup('viajero/doc', app, document);
  const port: number = parseInt(process.env.PORT);

  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port || 3000);
  setDefaultUser(config);
  //app.enableCors();
}
bootstrap();
