import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({ 
    origin: '*',
    allowedHeaders: '*',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
      
  setupSwagger(app); 
  await app.listen(process.env.PORT || 5001);
  console.log(`Server start on port ${app.getHttpServer().address().port}\nConnected To Database`)
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('KGate Backend Enhancements')
    .setDescription('KGate API Documentation')
    .setVersion('1.0') 
    .addBearerAuth()
    .build();

  const dOptions: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  }

  const options: SwaggerCustomOptions = {
    explorer: true,
    swaggerOptions: {
      requestBodyModels: {
        useDefinitionRef: true,
      },
    },
  }

  const document = SwaggerModule.createDocument(app, config, dOptions);
  SwaggerModule.setup('api-docs', app, document, options);
}

bootstrap();
