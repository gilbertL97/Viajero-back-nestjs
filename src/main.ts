import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { CountryModule } from './country/country.module';
import { CoverageModule } from './coverage/coverage.module';
import { FileModule } from './file/file.module';
import { TravelerModule } from './traveler/traveler.module';
import { validateEnv } from './config/envValidation';

async function bootstrap() {
  validateEnv();
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
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger, {
    ignoreGlobalPrefix: false,
    include: [
      AuthModule,
      CountryModule,
      CoverageModule,
      FileModule,
      TravelerModule,
    ],
  });
  SwaggerModule.setup('viajero/doc', app, document, {
    swaggerOptions: {
      lang: 'es', // Establece el idioma a español
    },
  });
  const port: number = parseInt(process.env.PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port || 3000);
  //setDefaultUser(config);

  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  });
}
bootstrap();
