import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { useContainer } from 'class-validator'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import { authConfig, authConfigSchema } from 'src/config/auth.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { AuthModule } from 'src/modules/auth/auth.module'
import { DatabaseModule } from 'src/modules/database/database.module'
import { TestingModule } from 'src/modules/testing/testing.module'
import { validationOptions } from 'src/utils/validation-options'

export const bootstrap = async (metadata: ModuleMetadata) => {
  const app = (
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, authConfig, appConfig],
          envFilePath: ['.env.test', '.env'],
          validationSchema: Joi.object({
            ...appConfigSchema,
            ...authConfigSchema,
            ...databaseConfigSchema,
          }),
        }),
        DatabaseModule,
        TestingModule,
        ...(metadata.imports ? metadata.imports : []),
      ],
      controllers: [...(metadata?.controllers ?? [])],
      providers: [
        ...(metadata?.providers ?? []),
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe(validationOptions),
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
      ],
      exports: [...(metadata?.exports ?? [])],
    }).compile()
  ).createNestApplication()

  useContainer(app.select(AuthModule), { fallbackOnErrors: true })

  app.setGlobalPrefix(app.get(ConfigService).get('app.apiPrefix')!, {
    exclude: ['/'],
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.init()

  return app
}
