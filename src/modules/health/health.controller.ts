// import { SwaggerAws, SwaggerAwsWithoutAuth } from '@app/decorator/swaggerAWS.decorator';
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  // @SwaggerAwsWithoutAuth({
  //   endpoint: 'v1/health',
  //   httpMethod: 'GET'
  // })
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
