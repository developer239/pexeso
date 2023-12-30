import { Logger, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import { AppModule } from 'src/app.module'
import { appConfig, AppConfigType } from 'src/config/app.config'
import {
  CreateGameRequestDto,
  Game,
  GamePlayer,
  JoinGameRequestDto,
  LeaveGameRequestDto,
  ExceptionResponseDto,
  GridSize,
  WebSocketEvent,
  StartGameRequestDto,
  GameCard,
  Card,
} from 'src/modules/game/dto/game.dto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const appConfigValues = app.get<AppConfigType>(appConfig.KEY)

  app.enableShutdownHooks()
  app.setGlobalPrefix(appConfigValues.apiPrefix, {
    exclude: ['/'],
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription(`${appConfigValues.name} Docs`)
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [
      CreateGameRequestDto,
      Game,
      GamePlayer,
      JoinGameRequestDto,
      LeaveGameRequestDto,
      ExceptionResponseDto,
      StartGameRequestDto,
      GridSize,
      GameCard,
      Card,
      WebSocketEvent,
    ],
  })
  SwaggerModule.setup('docs', app, document)

  await app.listen(appConfigValues.port)
  Logger.log(`Running on port: ${appConfigValues.port}`, 'NestApplication')
  Logger.log(`Docs running on: ${appConfigValues.port}/docs`, 'NestApplication')
}

void bootstrap()
