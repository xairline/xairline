/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { getLogger } from '@xairline/shared-logger';
import * as bodyParser from 'body-parser';
// somewhere in your initialization file
const logger = getLogger();
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';

    // somewhere in your initialization file
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;
    const options = new DocumentBuilder()
      .setTitle('X Airline')
      .setDescription('X Airline')
      .setVersion('1.1')
      .addServer(
        environment.production
          ? 'https://xairline.herokuapp.com'
          : 'http://localhost:3333'
      )

      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '100mb' }));
    await app.listen(port, () => {
      Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
    });
  } catch (e) {
    logger.error(e);
  }
}

bootstrap();
