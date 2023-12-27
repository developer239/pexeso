import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from 'src/modules/health/health.controller'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
