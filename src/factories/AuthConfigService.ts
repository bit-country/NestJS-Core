import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
} from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService implements ClientsModuleOptionsFactory {
  constructor(
    @Inject()
    private configService: ConfigService,
  ) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    return {
      transport: Transport.TCP,
      options: {
        host: this.configService.get('AUTH_SERVICE_HOST'),
        port: this.configService.get('AUTH_SERVICE_TCP_PORT'),
      },
    };
  }
}
