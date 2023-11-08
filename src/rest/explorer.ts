import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { ROUTE_NAME } from './constants';
import { HttpMetadata } from './metadata';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GenericFunction } from '../constants/common';

@Injectable()
export class HttpExplorer {
  constructor(
    private readonly config: ConfigService,
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    HttpMetadata.setBaseUrl(this.config.get('app.url'));

    const wrappers = this.discovery.getControllers();

    wrappers.forEach((w) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { instance, metatype } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) =>
          this.lookupListeners(
            instance,
            key,
            Reflect.getMetadata(PATH_METADATA, w.metatype),
          ),
      );
    });
  }

  lookupListeners(
    instance: Record<string, GenericFunction>,
    key: string,
    baseRoute?: string,
  ) {
    baseRoute = baseRoute || '';
    const hasRouteName = Reflect.hasMetadata(ROUTE_NAME, instance, key);
    if (!hasRouteName) return;
    const routeName = Reflect.getMetadata(ROUTE_NAME, instance, key);
    HttpMetadata.addNamedRoute(
      routeName,
      join(baseRoute, Reflect.getMetadata(PATH_METADATA, instance[key])),
    );
  }
}
