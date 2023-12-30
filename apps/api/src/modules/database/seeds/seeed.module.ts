import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { appConfig } from 'src/config/app.config'
import { databaseConfig } from 'src/config/database.config'
import { GameSeedModule } from 'src/modules/database/seeds/game/game-seed.module'
import { UserSeedModule } from 'src/modules/database/seeds/user/user-seed.module'
import { TypeOrmConfigService } from 'src/modules/database/typeorm-config.service'

@Module({
  imports: [
    UserSeedModule,
    GameSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('No options provided to TypeOrmModule.forRootAsync')
        }

        return new DataSource(options).initialize()
      },
    }),
  ],
})
export class SeedModule {}
