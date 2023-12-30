import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { GameRepository } from 'src/modules/game/entities/game.repository'
import { GameGateway } from 'src/modules/game/game.gateway'
import { GameService } from 'src/modules/game/services/game.service'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Game, User, GamePlayer]),
  ],
  providers: [GameService, GameGateway, GameRepository, UsersRepository],
  exports: [GameService],
})
export class GameModule {}
