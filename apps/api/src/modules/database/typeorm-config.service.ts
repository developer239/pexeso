import { Inject, Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { appConfig, AppConfigType } from 'src/config/app.config'
import { databaseConfig, DatabaseConfigType } from 'src/config/database.config'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly databaseConfigValues: DatabaseConfigType,
    @Inject(appConfig.KEY)
    private readonly appConfigValues: AppConfigType
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // For some reason, Vitest doesn't like the js file extension even though it shouldn't load migrations
    const isVitest = this.appConfigValues.nodeEnv === 'test'

    return {
      type: 'postgres',
      url: this.databaseConfigValues.databaseUrl,
      autoLoadEntities: true,
      logging: ['error'],
      migrations: isVitest ? [] : [`${__dirname}/migrations/**/*{.ts,.js}`],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/modules/database/migrations',
        subscribersDir: 'subscriber',
      },
    } as TypeOrmModuleOptions
  }
}
