import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { DefaultConfiguration } from 'src/modules/game/entities/default-configuration.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { GameGateway } from 'src/modules/game/game.gateway'
import { GameService } from 'src/modules/game/services/game.service'
import { SocketService } from 'src/modules/game/services/socket.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User, DefaultConfiguration, GamePlayer]),
  ],
  providers: [GameService, GameGateway, SocketService],
  exports: [GameService],
})
export class GameModule {}
