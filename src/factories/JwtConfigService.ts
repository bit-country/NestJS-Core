import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  JwtModuleOptions,
  JwtOptionsFactory,
} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { authConfig } from '@config/auth.config';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(authConfig.KEY)
    private authCfg: ConfigType<typeof authConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    const { jwtSecret, jwtExpiresIn } = this.authCfg;
    return {
      secret: jwtSecret!,
      signOptions: { expiresIn: jwtExpiresIn },
    };
  }
}
