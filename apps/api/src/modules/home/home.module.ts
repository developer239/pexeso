import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HomeController } from 'src/modules/home/home.controller'
import { HomeService } from 'src/modules/home/home.service'

@Module({
  imports: [ConfigModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
