import { NestFactory } from '@nestjs/core';
import { ServiceMainModule } from './service-main.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(ServiceMainModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow all origins (or specify the ones you trust)
      callback(null, true);
    },
  });
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  const options = new DocumentBuilder()
    .setTitle('bizz-buzz Service')
    .setDescription('APIs for Bizz&buzz Main Service')
    .addServer('http://localhost:3000')
    .addServer('http://dev.bizandbuz.com/api/')
    .addServer('https://app.bizandbuz.com/api/')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('open-api', app, document);
  await app.listen(3000);
}
bootstrap();
