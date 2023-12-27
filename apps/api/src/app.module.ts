import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import { authConfig, authConfigSchema } from 'src/config/auth.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { AuthModule } from 'src/modules/auth/auth.module'
import { DatabaseModule } from 'src/modules/database/database.module'
import { HomeModule } from 'src/modules/home/home.module'
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter'
import { validationOptions } from 'src/utils/validation-options'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 15,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, authConfig],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
        ...authConfigSchema,
      }),
    }),
    DatabaseModule,
    AuthModule,
    HomeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationOptions),
    },
    {
      provide: APP_FILTER,
      useValue: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
