import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { serviceConfig } from '@config/services.config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(
    @Inject(serviceConfig.KEY)
    private serviceCfg: ConfigType<typeof serviceConfig>,
  ) {}

  createHttpOptions(): HttpModuleOptions {
    return this.serviceCfg.axios;
  }
}
