import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'
import { Card } from 'src/modules/game/entities/card.entity'
import { CardRepository } from 'src/modules/game/entities/card.repository'
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { GameRepository } from 'src/modules/game/entities/game.repository'
import { GameGateway } from 'src/modules/game/game.gateway'
import { GameService } from 'src/modules/game/services/game.service'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Game, User, GamePlayer, Card, GameCard]),
  ],
  providers: [
    GameService,
    GameGateway,
    GameRepository,
    UsersRepository,
    CardRepository,
  ],
  exports: [GameService],
})
export class GameModule {}
