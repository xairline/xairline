import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  DATAREF_BATCH_SIZE,
  DATAREF_FEQ,
  DATAREF_FEQ_LANDING,
  DATAREF_STR,
} from '@xairline/shared-xplane-data';
import { app, BrowserWindow } from 'electron';
import { AppModule } from './app.module';
import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import { environment } from './environments/environment';
import { XPlaneClient } from './XPlaneClient';
import { getLogger } from '@xairline/shared-logger';
import * as bodyParser from 'body-parser';
process.env.PRODUCTION = environment.production ? 'true' : 'false';
const log = getLogger();
export default class Main {
  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }
  }

  static bootstrapApp() {
    App.main(app, BrowserWindow);
  }

  static bootstrapAppEvents() {
    ElectronEvents.bootstrapElectronEvents();

    // initialize auto updater service
    if (!App.isDevelopmentMode()) {
      // UpdateEvents.initAutoUpdateService();
    }
  }

  static async bootstrapNestJsBackend() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';

    // somewhere in your initialization file
    app.setGlobalPrefix(globalPrefix);
    const port = 4200;
    if (!environment.production) {
      const options = new DocumentBuilder()
        .setTitle('X Airline')
        .setDescription('X Airline')
        .setVersion('1.0')
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api/docs', app, document);
    }
    // the next two lines did the trick
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
    const server = app.getHttpServer();
    server.on('upgrade', function upgrade(request, socket, head) {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });
    await app.listen(port, () => {
      Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
    });
  }
}

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapNestJsBackend();
Main.bootstrapAppEvents();

// ws
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', function connection(ws, request) {
  // xplane
  let connected = false;
  let results: any[] = [];
  const xPlane = new XPlaneClient({
    dataRefCallback: (result) => {
      connected = true;
      results.push(result);
      if (results.length === DATAREF_BATCH_SIZE) {
        ws.send(JSON.stringify(results));
        log.debug(`${results.length} - sent`);
        results = [];
      }
    },
    debug: false,
  });
  const requestDataRef = (freq: number) => {
    xPlane.requestDataRef(DATAREF_STR.N1, freq);
    xPlane.requestDataRef(DATAREF_STR.ELEVATION, freq);
    xPlane.requestDataRef(DATAREF_STR.GS, freq);
    xPlane.requestDataRef(DATAREF_STR.AGL, freq);
    xPlane.requestDataRef(DATAREF_STR.G_FORCE, freq);
    xPlane.requestDataRef(DATAREF_STR.VS, freq);
    xPlane.requestDataRef(DATAREF_STR.GEAR_FORCE, freq);
    xPlane.requestDataRef(DATAREF_STR.PITCH, freq);
    xPlane.requestDataRef(DATAREF_STR.IAS, freq);
    xPlane.requestDataRef(DATAREF_STR.LAT, freq);
    xPlane.requestDataRef(DATAREF_STR.LNG, freq);
    xPlane.requestDataRef(DATAREF_STR.TS,freq)
    log.info(`set dataref freq: ${freq}`);
  };

  setInterval(function () {
    if (!connected) {
      if (xPlane.client) {
        xPlane.client.close();
        xPlane.client = null;
      }
      xPlane.initConnection();
      requestDataRef(0);
      requestDataRef(DATAREF_FEQ);
    }
  }, 3000);

  // Handle all messages from users.
  ws.on('message', function (msgStr) {
    requestDataRef(DATAREF_FEQ_LANDING);
  });
  // What to do when client disconnect?
  ws.on('close', function (connection) {
    if (xPlane.client) {
      requestDataRef(0);
      xPlane.client.close();
      xPlane.client = null;
    }
  });
});
