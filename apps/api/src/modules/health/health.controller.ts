import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { HealthDTO } from 'src/modules/health/dto/health.dto'

@ApiTags('Health')
@Controller({
  path: 'health',
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator
  ) {}

  @ApiOkResponse({
    description: 'Minimal health check',
    type: HealthDTO,
  })
  @Get()
  check() {
    return this.health.check([() => this.db.pingCheck('database')])
  }
}
