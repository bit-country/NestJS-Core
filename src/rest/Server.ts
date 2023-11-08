import { RestDocument } from '@libs/core/rest/RestDocument';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as process from 'process';
import { ExceptionFilter } from '../exceptions';
import { RequestGuard } from './guards';
import { ServerOptions } from './interfaces';
import { ENV } from '@libs/core/constants/common';
import { TransformInterceptor } from '@libs/core/interceptors/transform.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';

export class Server {
  private module: any;
  private options: ServerOptions;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(module: any, options?: ServerOptions): Promise<void> {
    try {
      const isDevelopment = process.env.NODE_ENV === ENV.DEVELOPMENT;
      const app = await NestFactory.create<NestExpressApplication>(module, {
        cors: options?.cors ? { origin: true } : false,
        bufferLogs: true,
      });

      app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
      app.use(helmet());
      app.use(compression());

      // const logger = app.get(Logger);
      // app.useLogger(logger);
      app.enableCors();
      app.useGlobalInterceptors(new TransformInterceptor());

      options?.addValidationContainer &&
        useContainer(app.select(module), { fallbackOnErrors: true });
      // options?.globalValidationPipe &&
      //   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      options?.globalValidationPipe &&
        app.useGlobalPipes(new ValidationPipe({}));
      options?.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

      const configService = app.get(ConfigService, { strict: false });

      const { httpAdapter } = app.get(HttpAdapterHost);
      app.useGlobalFilters(new ExceptionFilter(httpAdapter));
      app.useGlobalGuards(new RequestGuard());

      if (options.enableDocument && options.hasRestApi) {
        await RestDocument.setup(app);
      }

      if (options.hasMicroservice) {
        app.connectMicroservice({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: configService.get('app.tcpPort'),
          },
        });
        console.log('Microservice is running');
        await app.startAllMicroservices();
        // const res = await app.startAllMicroservices();
        // console.log(res);
      }

      // Starts listening for shutdown hooks
      if (!isDevelopment) {
        app.enableShutdownHooks();
      }

      if (options?.hasRestApi) {
        // const host = isDevelopment ? 'localhost' : '0.0.0.0';
        const host = '0.0.0.0';
        const port = options.port || configService.get('app.port');

        await app.listen(port, host);
        // console.log(`Server starting with ${host}:${port}`);
        console.log(`Server running on  ${await app.getUrl()}`);

        // process.env.NODE_ENV === 'production'
        //   ? logger.log(
        //       `Server ready at https://${host!}:${chalk
        //         .hex('#87e8de')
        //         .bold(`${port!}`)}`,
        //       'Bootstrap',
        //     )
        //   : logger.log(
        //       `Server is listening on port ${chalk
        //         .hex('#87e8de')
        //         .bold(`${port!}`)}`,
        //       'Bootstrap',
        //     );
      }
    } catch (error) {
      // logger.error(error)
      console.error(`Error starting server, ${error}`, '', 'Bootstrap', false);
      process.exit();
    }
  }
}
